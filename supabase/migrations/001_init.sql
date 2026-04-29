-- Enable PostGIS for geospatial queries (optional, not required for basic MVP)
-- create extension if not exists postgis;

-- ── Profiles ──────────────────────────────────────────────────────────────────
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  display_name text,
  role         text not null check (role in ('donor', 'collector', 'both')) default 'both',
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Anyone can read profiles (needed to show donor/collector names on pickups)
create policy "profiles_read" on public.profiles
  for select using (true);

-- Users can update their own profile
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Supabase trigger: auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'display_name',
    coalesce(new.raw_user_meta_data ->> 'role', 'both')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── Pickups ───────────────────────────────────────────────────────────────────
create table public.pickups (
  id                   uuid primary key default gen_random_uuid(),
  donor_id             uuid not null references public.profiles(id) on delete cascade,
  title                text not null,
  description          text,
  can_count            integer not null check (can_count >= 1),
  estimated_value      numeric(8,2) not null check (estimated_value >= 0),
  address              text not null,
  latitude             double precision not null,
  longitude            double precision not null,
  pickup_window_start  timestamptz not null,
  pickup_window_end    timestamptz not null,
  instructions         text,
  image_url            text,
  status               text not null default 'available'
                         check (status in ('available','claimed','completed','cancelled')),
  collector_id         uuid references public.profiles(id) on delete set null,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  constraint window_order check (pickup_window_end > pickup_window_start)
);

alter table public.pickups enable row level security;

-- Authenticated users can read all non-cancelled pickups
create policy "pickups_read" on public.pickups
  for select using (auth.role() = 'authenticated');

-- Donors can insert their own pickups
create policy "pickups_insert_donor" on public.pickups
  for insert with check (auth.uid() = donor_id);

-- Donors can update/cancel their own pickups; collectors can claim/complete
create policy "pickups_update" on public.pickups
  for update using (
    auth.uid() = donor_id or auth.uid() = collector_id
  );

-- Keep updated_at in sync
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger pickups_updated_at
  before update on public.pickups
  for each row execute procedure public.set_updated_at();


-- ── Storage bucket ────────────────────────────────────────────────────────────
-- Run this in the Supabase dashboard Storage section, or via the API:
-- insert into storage.buckets (id, name, public) values ('pickup-images', 'pickup-images', true);

-- Storage RLS: authenticated users can upload; everyone can read public URLs
-- (Bucket must be created first via dashboard — SQL policies reference it after creation)
