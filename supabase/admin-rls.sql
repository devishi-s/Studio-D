-- Studio D — Phase 4.4 admin flag + RLS
-- Run in the Supabase SQL Editor after schema.sql / orders-checkout.sql.
-- Safe to re-run.

begin;

-- ── profiles.is_admin ────────────────────────────────────────

alter table public.profiles
  add column if not exists is_admin boolean not null default false;

create index if not exists profiles_is_admin_idx
  on public.profiles (is_admin)
  where is_admin = true;

-- Helper used by RLS policies (security definer avoids recursion)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select p.is_admin
      from public.profiles p
      where p.id = auth.uid()
    ),
    false
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ── profiles: admins can read all profiles (customer names) ───

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
  on public.profiles
  for select
  to authenticated
  using (public.is_admin());

-- Prevent non-admins from escalating their own is_admin flag via client update.
-- Users may still update name/avatar; is_admin is enforced by a trigger.

create or replace function public.prevent_is_admin_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_admin is distinct from old.is_admin then
    -- SQL Editor / migrations have no JWT (auth.uid() is null).
    -- Allow that path so the first admin can be bootstrapped.
    -- Client requests always have auth.uid() and must already be admin.
    if auth.uid() is not null and not public.is_admin() then
      raise exception 'Only an existing admin can change is_admin';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_is_admin_escalation on public.profiles;
create trigger profiles_prevent_is_admin_escalation
  before update on public.profiles
  for each row
  execute function public.prevent_is_admin_escalation();

-- ── products: admin write (public read already exists) ────────

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
  on public.products
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
  on public.products
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
  on public.products
  for delete
  to authenticated
  using (public.is_admin());

-- ── orders: admin read/update all ────────────────────────────

drop policy if exists "Admins can read all orders" on public.orders;
create policy "Admins can read all orders"
  on public.orders
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update all orders" on public.orders;
create policy "Admins can update all orders"
  on public.orders
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── order_items: admin read all ──────────────────────────────

drop policy if exists "Admins can read all order items" on public.order_items;
create policy "Admins can read all order items"
  on public.order_items
  for select
  to authenticated
  using (public.is_admin());

commit;

-- Promote yourself after running (replace with your auth user UUID):
-- update public.profiles set is_admin = true where email = 'you@example.com';
