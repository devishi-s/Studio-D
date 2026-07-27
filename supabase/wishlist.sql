-- Studio D — Phase 5.5 wishlist (save for later)
-- Run in the Supabase SQL Editor after schema.sql / reviews.sql.
-- Safe to re-run.

begin;

create table if not exists public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id text not null references public.products (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  constraint wishlist_user_product_unique unique (user_id, product_id)
);

create index if not exists wishlist_user_id_idx
  on public.wishlist (user_id, created_at desc);

create index if not exists wishlist_product_id_idx
  on public.wishlist (product_id);

alter table public.wishlist enable row level security;

drop policy if exists "Users can read own wishlist" on public.wishlist;
create policy "Users can read own wishlist"
  on public.wishlist
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own wishlist" on public.wishlist;
create policy "Users can insert own wishlist"
  on public.wishlist
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own wishlist" on public.wishlist;
create policy "Users can delete own wishlist"
  on public.wishlist
  for delete
  to authenticated
  using (auth.uid() = user_id);

commit;
