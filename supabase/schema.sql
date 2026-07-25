-- Studio D — Phase 3.1 schema, indexes, triggers, and RLS
-- Run this in the Supabase SQL Editor (or via CLI) before seed.sql.
--
-- Decisions:
-- - products.id is text matching the static catalog (prod-1 …) so cart IDs stay stable.
-- - category stores the category slug (e.g. crochet-flowers) for Phase 3.1.
--   A dedicated categories table can land during product migration (3.2) if needed.
-- - compare_at_price, tags, and is_active are retained so the seed is not lossy.
-- - Admin product writes use the service role (bypasses RLS). No client write policies.

begin;

create extension if not exists "pgcrypto";

-- ── products ─────────────────────────────────────────────────

create table if not exists public.products (
  id text primary key,
  slug text not null unique,
  name text not null,
  description text not null,
  price numeric(10, 2) not null check (price >= 0),
  compare_at_price numeric(10, 2) check (
    compare_at_price is null or compare_at_price >= 0
  ),
  category text not null,
  images text[] not null default '{}',
  tags text[] not null default '{}',
  featured boolean not null default false,
  is_active boolean not null default true,
  materials text[] not null default '{}',
  dimensions text,
  stock_count integer not null default 0 check (stock_count >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_featured_idx on public.products (featured)
  where featured = true and is_active = true;
create index if not exists products_created_at_idx on public.products (created_at desc);

-- ── profiles ─────────────────────────────────────────────────

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists profiles_email_idx on public.profiles (email);
create index if not exists profiles_is_admin_idx
  on public.profiles (is_admin)
  where is_admin = true;

-- Keep profiles in sync when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.email,
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
    set
      email = excluded.email,
      full_name = coalesce(excluded.full_name, public.profiles.full_name),
      avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ── orders ───────────────────────────────────────────────────

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete restrict,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total numeric(12, 2) not null check (total >= 0),
  shipping_address jsonb,
  razorpay_order_id text,
  razorpay_payment_id text,
  needs_manual_review boolean not null default false,
  review_notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create unique index if not exists orders_razorpay_order_id_uidx
  on public.orders (razorpay_order_id)
  where razorpay_order_id is not null;
create unique index if not exists orders_razorpay_payment_id_uidx
  on public.orders (razorpay_payment_id)
  where razorpay_payment_id is not null;

-- ── order_items ──────────────────────────────────────────────

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id text not null references public.products (id) on delete restrict,
  quantity integer not null check (quantity > 0),
  price_at_purchase numeric(10, 2) not null check (price_at_purchase >= 0)
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists order_items_product_id_idx on public.order_items (product_id);

-- ── Row Level Security ───────────────────────────────────────

alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- products: public read; writes only via service role (no client policies)
drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
  on public.products
  for select
  to anon, authenticated
  using (true);

-- profiles: users manage their own row
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- orders: users read/insert/update their own orders
drop policy if exists "Users can read own orders" on public.orders;
create policy "Users can read own orders"
  on public.orders
  for select
  to authenticated
  using (auth.uid() = user_id);

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

-- order_items: users read/insert items belonging to their orders only
drop policy if exists "Users can read own order items" on public.order_items;
create policy "Users can read own order items"
  on public.order_items
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.orders
      where public.orders.id = order_items.order_id
        and public.orders.user_id = auth.uid()
    )
  );

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

-- Atomic stock decrement for checkout (race-safe shortfall reporting)
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
    return jsonb_build_object('ok', false, 'error', 'invalid_quantity');
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
