-- ============================================================
-- LandlordShield — Supabase Schema
-- Paste this entire file into Supabase SQL Editor and run it.
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── users ────────────────────────────────────────────────────
-- Extends Supabase Auth (auth.users) with app-specific data
create table public.users (
  id                    uuid primary key references auth.users(id) on delete cascade,
  email                 text not null,
  name                  text,
  stripe_customer_id    text unique,
  stripe_subscription_id text,
  subscription_tier     text not null default 'free' check (subscription_tier in ('free', 'pro')),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Auto-populate from auth.users on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── properties ───────────────────────────────────────────────
create table public.properties (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.users(id) on delete cascade,
  state          char(2) not null,               -- e.g. 'CA', 'NY'
  city           text,
  property_type  text,                            -- 'single-family', 'multi-family', etc.
  nickname       text,                            -- e.g. "123 Main St"
  created_at     timestamptz not null default now()
);

create index properties_user_id_idx on public.properties(user_id);
create index properties_state_idx   on public.properties(state);

-- ── law_alerts ───────────────────────────────────────────────
create table public.law_alerts (
  id                  uuid primary key default uuid_generate_v4(),
  state               char(2) not null,
  title               text not null,
  legiscan_bill_id    text unique,
  source_url          text,
  plain_summary       text,
  action_required     text,
  deadline            text,
  alert_level         text not null default 'medium' check (alert_level in ('high', 'medium', 'low')),
  affects_types       text[] default '{}',
  created_at          timestamptz not null default now()
);

create index law_alerts_state_idx       on public.law_alerts(state);
create index law_alerts_level_idx       on public.law_alerts(alert_level);
create index law_alerts_created_at_idx  on public.law_alerts(created_at desc);

-- ── user_alerts ──────────────────────────────────────────────
-- Tracks which alerts have been sent to which users (prevents duplicates)
create table public.user_alerts (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.users(id) on delete cascade,
  law_alert_id   uuid not null references public.law_alerts(id) on delete cascade,
  sent_at        timestamptz not null default now(),
  read_at        timestamptz,
  unique (user_id, law_alert_id)
);

create index user_alerts_user_id_idx on public.user_alerts(user_id);

-- ── ai_queries ───────────────────────────────────────────────
-- Anonymised log of Ask-the-Law queries for improving the product
create table public.ai_queries (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.users(id) on delete set null,
  state       char(2),
  created_at  timestamptz not null default now()
);

-- ============================================================
-- Row-Level Security (RLS)
-- Users can only read/write their own data.
-- ============================================================

alter table public.users       enable row level security;
alter table public.properties  enable row level security;
alter table public.user_alerts enable row level security;
alter table public.ai_queries  enable row level security;

-- law_alerts is public read (everyone can see law changes)
alter table public.law_alerts  enable row level security;

create policy "Users can read own profile"      on public.users       for select using (auth.uid() = id);
create policy "Users can update own profile"    on public.users       for update using (auth.uid() = id);

create policy "Users can manage own properties" on public.properties  for all    using (auth.uid() = user_id);

create policy "Anyone can read law alerts"      on public.law_alerts  for select using (true);

create policy "Users can read own alerts"       on public.user_alerts for select using (auth.uid() = user_id);

create policy "Users can log own AI queries"    on public.ai_queries  for insert with check (auth.uid() = user_id);
