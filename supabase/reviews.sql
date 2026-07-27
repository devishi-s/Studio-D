-- Studio D — Phase 5.4 product reviews
-- Run in the Supabase SQL Editor after schema.sql / admin-rls.sql.
-- Safe to re-run.

begin;

-- ── reviews ──────────────────────────────────────────────────

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text not null check (char_length(trim(title)) > 0),
  body text not null check (char_length(trim(body)) >= 20),
  is_approved boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  constraint reviews_product_user_unique unique (product_id, user_id)
);

create index if not exists reviews_product_id_idx on public.reviews (product_id);
create index if not exists reviews_user_id_idx on public.reviews (user_id);
create index if not exists reviews_approved_idx
  on public.reviews (product_id, created_at desc)
  where is_approved = true;
create index if not exists reviews_pending_idx
  on public.reviews (created_at desc)
  where is_approved = false;

alter table public.reviews enable row level security;

-- Anyone can read approved reviews
drop policy if exists "Anyone can read approved reviews" on public.reviews;
create policy "Anyone can read approved reviews"
  on public.reviews
  for select
  to anon, authenticated
  using (is_approved = true);

-- Authors can read their own review (including pending)
drop policy if exists "Users can read own reviews" on public.reviews;
create policy "Users can read own reviews"
  on public.reviews
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Admins can read all reviews (pending + approved)
drop policy if exists "Admins can read all reviews" on public.reviews;
create policy "Admins can read all reviews"
  on public.reviews
  for select
  to authenticated
  using (public.is_admin());

-- Authenticated users insert their own review only
drop policy if exists "Users can insert own reviews" on public.reviews;
create policy "Users can insert own reviews"
  on public.reviews
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and is_approved = false
  );

-- Admins approve / unapprove
drop policy if exists "Admins can update reviews" on public.reviews;
create policy "Admins can update reviews"
  on public.reviews
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Admins delete (reject)
drop policy if exists "Admins can delete reviews" on public.reviews;
create policy "Admins can delete reviews"
  on public.reviews
  for delete
  to authenticated
  using (public.is_admin());

-- Let storefront join reviewer display names for approved reviews
drop policy if exists "Public can read approved reviewer names" on public.profiles;
create policy "Public can read approved reviewer names"
  on public.profiles
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.reviews r
      where r.user_id = profiles.id
        and r.is_approved = true
    )
  );

commit;
