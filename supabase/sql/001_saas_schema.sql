-- SaaS schema for Pastillas app
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  plan_tier text not null default 'free' check (plan_tier in ('free', 'pro')),
  stripe_customer_id text unique,
  stripe_subscription_status text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.medications (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  nombre text not null,
  cantidad numeric(10,2) not null check (cantidad > 0),
  tiempo text not null,
  tomada boolean not null default false,
  notification_id text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_medications_user_id on public.medications(user_id);
create index if not exists idx_medications_tiempo on public.medications(tiempo);

create table if not exists public.medication_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  medication_id text not null references public.medications(id) on delete cascade,
  event_type text not null check (event_type in ('taken', 'untaken')),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_medication_events_user_created
  on public.medication_events(user_id, created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, coalesce(new.email, 'unknown@example.com'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.medications enable row level security;
alter table public.medication_events enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "medications_select_own" on public.medications;
create policy "medications_select_own"
on public.medications for select
using (auth.uid() = user_id);

drop policy if exists "medications_insert_own" on public.medications;
create policy "medications_insert_own"
on public.medications for insert
with check (auth.uid() = user_id);

drop policy if exists "medications_update_own" on public.medications;
create policy "medications_update_own"
on public.medications for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "medications_delete_own" on public.medications;
create policy "medications_delete_own"
on public.medications for delete
using (auth.uid() = user_id);

drop policy if exists "medication_events_select_own" on public.medication_events;
create policy "medication_events_select_own"
on public.medication_events for select
using (auth.uid() = user_id);

drop policy if exists "medication_events_insert_own" on public.medication_events;
create policy "medication_events_insert_own"
on public.medication_events for insert
with check (auth.uid() = user_id);
