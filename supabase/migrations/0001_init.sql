-- ============================================================
-- Giveaway backend — initial schema
-- Run this in Supabase: SQL Editor → New query → paste → Run
-- ============================================================

-- ---------- ENUMS ----------
do $$ begin
  create type giveaway_status as enum ('Draft', 'Scheduled', 'Live', 'Closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type winner_status as enum ('Pending', 'Contacted', 'Claimed', 'Unclaimed');
exception when duplicate_object then null; end $$;

-- ---------- GIVEAWAYS ----------
create table if not exists public.giveaways (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  prize         text not null,
  description   text,
  banner_url    text,
  winners_count int  not null default 1,
  start_date    timestamptz,
  end_date      timestamptz,
  status        giveaway_status not null default 'Draft',
  -- rules
  multiple_entries          boolean not null default false,
  email_verification        boolean not null default false,
  lifetime_winner_restrict  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------- ENTRIES (single table, linked by giveaway_id) ----------
create table if not exists public.entries (
  id           uuid primary key default gen_random_uuid(),
  giveaway_id  uuid not null references public.giveaways(id) on delete cascade,
  name         text not null,
  email        text not null,
  phone        text,
  country      text,
  is_verified  boolean not null default false,
  source       text default 'Website',
  created_at   timestamptz not null default now()
);

-- One email can enter a given giveaway only once.
create unique index if not exists entries_unique_email_per_giveaway
  on public.entries (giveaway_id, lower(email));

create index if not exists entries_giveaway_idx on public.entries (giveaway_id);

-- ---------- WINNERS ----------
create table if not exists public.winners (
  id             uuid primary key default gen_random_uuid(),
  entry_id       uuid not null references public.entries(id) on delete cascade,
  giveaway_id    uuid not null references public.giveaways(id) on delete cascade,
  email          text not null,
  prize          text,
  status         winner_status not null default 'Pending',
  won_at         timestamptz not null default now(),
  contacted_at   timestamptz,
  claimed_at     timestamptz
);

-- LIFETIME RULE: an email can win only ONCE, ever.
create unique index if not exists winners_unique_email_lifetime
  on public.winners (lower(email));

-- ---------- updated_at trigger for giveaways ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists giveaways_set_updated_at on public.giveaways;
create trigger giveaways_set_updated_at
  before update on public.giveaways
  for each row execute function public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.giveaways enable row level security;
alter table public.entries   enable row level security;
alter table public.winners   enable row level security;

-- Public can read giveaways that are visible (to render the form / public pages)
drop policy if exists "public reads visible giveaways" on public.giveaways;
create policy "public reads visible giveaways"
  on public.giveaways for select
  using (status in ('Live', 'Scheduled', 'Closed'));

-- Public can insert an entry ONLY into a giveaway currently Live
drop policy if exists "public inserts entries into live giveaway" on public.entries;
create policy "public inserts entries into live giveaway"
  on public.entries for insert
  with check (
    exists (
      select 1 from public.giveaways g
      where g.id = giveaway_id and g.status = 'Live'
    )
  );

-- NOTE: No public select policy on entries/winners → the public cannot read them.
-- Admin reads/writes happen server-side with the service_role key (bypasses RLS).

-- ============================================================
-- DRAW WINNERS — random, fair, enforces lifetime rule atomically
-- ============================================================
create or replace function public.draw_winners(p_giveaway_id uuid, p_count int)
returns setof public.winners
language plpgsql
security definer
set search_path = public
as $$
declare
  v_prize text;
begin
  select prize into v_prize from public.giveaways where id = p_giveaway_id;

  return query
  with eligible as (
    select e.*
    from public.entries e
    where e.giveaway_id = p_giveaway_id
      and e.is_verified = true
      -- exclude anyone who has EVER won (lifetime rule)
      and not exists (
        select 1 from public.winners w
        where lower(w.email) = lower(e.email)
      )
    order by random()
    limit p_count
  )
  insert into public.winners (entry_id, giveaway_id, email, prize)
  select id, p_giveaway_id, email, v_prize from eligible
  returning *;
end;
$$;
