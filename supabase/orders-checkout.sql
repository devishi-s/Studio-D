-- Studio D — Phase 4.3 order checkout columns, RLS inserts, stock RPC
-- Run in the Supabase SQL Editor after schema.sql (existing projects).
-- Safe to re-run (IF NOT EXISTS / DROP POLICY IF EXISTS).

begin;

-- ── orders: payment + shipping fields ────────────────────────

alter table public.orders
  add column if not exists shipping_address jsonb;

alter table public.orders
  add column if not exists razorpay_order_id text;

alter table public.orders
  add column if not exists razorpay_payment_id text;

alter table public.orders
  add column if not exists needs_manual_review boolean not null default false;

alter table public.orders
  add column if not exists review_notes text;

create unique index if not exists orders_razorpay_order_id_uidx
  on public.orders (razorpay_order_id)
  where razorpay_order_id is not null;

create unique index if not exists orders_razorpay_payment_id_uidx
  on public.orders (razorpay_payment_id)
  where razorpay_payment_id is not null;

-- ── RLS: authenticated users can create their own orders ─────

drop policy if exists "Users can insert own orders" on public.orders;
create policy "Users can insert own orders"
  on public.orders
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own orders" on public.orders;
create policy "Users can update own orders"
  on public.orders
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can insert own order items" on public.order_items;
create policy "Users can insert own order items"
  on public.order_items
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.orders
      where public.orders.id = order_items.order_id
        and public.orders.user_id = auth.uid()
    )
  );

-- ── Stock decrement (handles race / shortfall gracefully) ────

create or replace function public.decrement_product_stock(
  p_product_id text,
  p_quantity integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_stock integer;
  applied integer;
  shortfall integer := 0;
begin
  if p_quantity is null or p_quantity < 1 then
    return jsonb_build_object(
      'ok', false,
      'error', 'invalid_quantity'
    );
  end if;

  select stock_count
  into current_stock
  from public.products
  where id = p_product_id
  for update;

  if not found then
    return jsonb_build_object(
      'ok', false,
      'error', 'not_found',
      'shortfall', p_quantity
    );
  end if;

  if current_stock >= p_quantity then
    applied := p_quantity;
    shortfall := 0;
  else
    applied := current_stock;
    shortfall := p_quantity - current_stock;
  end if;

  update public.products
  set stock_count = current_stock - applied
  where id = p_product_id;

  return jsonb_build_object(
    'ok', true,
    'previous', current_stock,
    'applied', applied,
    'remaining', current_stock - applied,
    'shortfall', shortfall
  );
end;
$$;

revoke all on function public.decrement_product_stock(text, integer) from public;
grant execute on function public.decrement_product_stock(text, integer) to authenticated;

commit;
