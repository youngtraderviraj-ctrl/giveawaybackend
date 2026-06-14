# Giveaway Backend Plan — Supabase + Next.js

This document is the build plan for turning the current **mock-data dashboard** into a real product backed by **Supabase** (Postgres + Auth + RLS).

## 1. Goal (in plain terms)

- A **public form** lives on `youngtraderviraj.com` (or a `/giveaway` route here) where people enter the active giveaway.
- The form only **accepts entries when you turn it ON** from the backend.
- A **private dashboard** (this app) stores all entries, lets you manage giveaways, and run a **random spinner** to pick winners.
- **New giveaway every day**, but only **one `entries` table** — every entry is linked to a `giveaway_id`.
- **One person can win only once in their lifetime** (across all giveaways).

## 2. Architecture

```
                 ┌─────────────────────────────┐
  Public user →  │  Public Entry Form           │  (Next.js route or embed on
                 │  /giveaway                   │   youngtraderviraj.com)
                 └──────────────┬──────────────┘
                                │ POST entry (only if giveaway is "Live")
                                ▼
                 ┌─────────────────────────────┐
                 │  Next.js Route Handlers /     │  app/api/* + Server Actions
                 │  Server Actions               │
                 └──────────────┬──────────────┘
                                │ Supabase JS client
                                ▼
                 ┌─────────────────────────────┐
                 │        Supabase Postgres      │  giveaways / entries / winners
                 │   + Row Level Security (RLS)  │
                 │   + Auth (admin login)        │
                 └──────────────┬──────────────┘
                                ▲
                 ┌──────────────┴──────────────┐
   You (admin) → │  Private Dashboard (this app) │  manage + draw winners
                 └─────────────────────────────┘
```

**Key decisions**

- **Public reads/writes** to the form use the `anon` key, locked down by **RLS** so users can only insert entries into a giveaway that is currently `Live`.
- **Admin actions** (create giveaway, open/close entries, draw winners) run **server-side** using the `service_role` key, which **never** ships to the browser.
- Winner selection runs in a **server action / RPC**, not in the browser, so it cannot be tampered with and the lifetime rule is enforced atomically.

## 3. Tech additions

| Concern | Choice |
| --- | --- |
| Database | Supabase Postgres |
| Admin auth | Supabase Auth (email magic link or password) |
| Client lib | `@supabase/supabase-js`, `@supabase/ssr` |
| Validation | `zod` for form + API payloads |
| Server logic | Next.js Route Handlers + Server Actions |

Install:

```bash
pnpm add @supabase/supabase-js @supabase/ssr zod
```

## 4. Database schema

> One `giveaways` table, one `entries` table (linked by `giveaway_id`), one `winners` table.
> The lifetime "win once" rule is enforced with a **unique constraint on the email in `winners`**.

```sql
-- ============ ENUMS ============
create type giveaway_status as enum ('Draft', 'Scheduled', 'Live', 'Closed');
create type winner_status   as enum ('Pending', 'Contacted', 'Claimed', 'Unclaimed');

-- ============ GIVEAWAYS ============
create table public.giveaways (
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

-- ============ ENTRIES (single table, linked by giveaway_id) ============
create table public.entries (
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

-- One email can enter a given giveaway only once (unless multiple_entries allowed).
-- Enforced for the default case via a unique index:
create unique index entries_unique_email_per_giveaway
  on public.entries (giveaway_id, lower(email));

create index entries_giveaway_idx on public.entries (giveaway_id);

-- ============ WINNERS ============
create table public.winners (
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

-- 🔒 LIFETIME RULE: an email can appear as a winner only ONCE, ever.
create unique index winners_unique_email_lifetime
  on public.winners (lower(email));
```

### Why this satisfies your requirements

- **One form, one entries table** → all entries go into `entries`, each row carries a `giveaway_id`.
- **New giveaway daily** → just insert a new row in `giveaways`; entries link to it.
- **Win once lifetime** → `winners_unique_email_lifetime` makes a second win for the same email **impossible at the DB level**, even if the draw code has a bug.

## 5. Row Level Security (RLS)

Enable RLS and write policies so the public can only insert entries into a `Live` giveaway.

```sql
alter table public.giveaways enable row level security;
alter table public.entries   enable row level security;
alter table public.winners   enable row level security;

-- Public can READ giveaways that are live/scheduled (to show on the form)
create policy "public reads visible giveaways"
  on public.giveaways for select
  using (status in ('Live', 'Scheduled', 'Closed'));

-- Public can INSERT an entry ONLY into a giveaway currently Live
create policy "public inserts entries into live giveaway"
  on public.entries for insert
  with check (
    exists (
      select 1 from public.giveaways g
      where g.id = giveaway_id and g.status = 'Live'
    )
  );

-- Public CANNOT read other people's entries or winners.
-- Admin access happens server-side via the service_role key (bypasses RLS).
```

> The "accepting entries only when I allow it" feature = setting a giveaway's `status` to `Live`. The RLS policy automatically blocks inserts the moment you set it back to `Closed`.

## 6. Environment variables

Create `.env.local` (and add the same keys in Vercel):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>      # safe for browser
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>  # SERVER ONLY — never expose
```

## 7. Supabase clients

```ts
// lib/supabase/client.ts  — browser (public form, anon key)
import { createBrowserClient } from '@supabase/ssr'

export const supabaseBrowser = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
```

```ts
// lib/supabase/admin.ts — server only (service role, bypasses RLS)
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
```

## 8. Public entry submission

Route handler validates input and lets RLS enforce the "Live only" rule.

```ts
// app/api/entries/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseBrowser } from '@/lib/supabase/client'

const EntrySchema = z.object({
  giveawayId: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  country: z.string().optional(),
})

export async function POST(req: Request) {
  const parsed = EntrySchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
  const { giveawayId, ...rest } = parsed.data
  const supabase = supabaseBrowser()

  const { error } = await supabase.from('entries').insert({
    giveaway_id: giveawayId,
    ...rest,
  })

  if (error) {
    // 23505 = unique violation (already entered) ; RLS block = generic error
    const msg = error.code === '23505'
      ? 'You already entered this giveaway.'
      : 'Entries are closed for this giveaway.'
    return NextResponse.json({ error: msg }, { status: 409 })
  }
  return NextResponse.json({ ok: true })
}
```

## 9. Drawing winners (server-side, enforces lifetime rule)

A Postgres function picks random eligible entries and writes winners atomically. Run as RPC from a server action.

```sql
create or replace function draw_winners(p_giveaway_id uuid, p_count int)
returns setof public.winners
language plpgsql
security definer
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
```

```ts
// app/(dashboard)/draw-winners/actions.ts
'use server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function drawWinners(giveawayId: string, count: number) {
  const supabase = supabaseAdmin()
  const { data, error } = await supabase.rpc('draw_winners', {
    p_giveaway_id: giveawayId,
    p_count: count,
  })
  if (error) throw new Error(error.message)
  return data
}
```

The existing canvas wheel in `app/(dashboard)/draw-winners/page.tsx` becomes **pure animation**; the **real winners come from `drawWinners()`**, so results are fair, server-verified, and lifetime-safe.

## 10. Admin actions to wire up

| Action | How |
| --- | --- |
| Create / edit giveaway | server action → `supabaseAdmin().from('giveaways')` |
| Open entries | set `status = 'Live'` |
| Close entries | set `status = 'Closed'` |
| List entries | server component reads `entries` filtered by `giveaway_id` |
| Draw winners | `drawWinners()` RPC above |
| Update winner status | update `winners.status` / `contacted_at` / `claimed_at` |

## 11. Replace mock data

Today every page imports from `lib/constants.ts`. The migration is: swap those imports for Supabase queries in **server components**, keeping `lib/types.ts` as the shared shape (map snake_case DB columns → camelCase types).

Files that currently use mock data:
- `app/(dashboard)/dashboard/page.tsx`
- `app/(dashboard)/giveaways/page.tsx`
- `app/(dashboard)/entries/page.tsx`
- `app/(dashboard)/winners/page.tsx`
- `app/(dashboard)/analytics/page.tsx`
- `app/(dashboard)/draw-winners/page.tsx`

## 12. Build roadmap (phased)

**Phase 0 — Setup** ✅ done in code
- [x] `pnpm add @supabase/supabase-js @supabase/ssr zod`
- [x] Add `lib/supabase/client.ts`, `lib/supabase/admin.ts`, `lib/supabase/server.ts`
- [x] Add `.env.example` (you still need to create Supabase project + fill `.env.local`)

**Phase 1 — Database** ✅ migration written
- [x] Schema + RLS + `draw_winners` in `supabase/migrations/0001_init.sql`
- [ ] **YOU:** run that SQL in the Supabase SQL editor
- [ ] **YOU:** seed one test giveaway with status `Live`

**Phase 2 — Public form** ✅ done in code
- [x] `/giveaway` page fetches the current `Live` giveaway
- [x] `app/api/entries/route.ts`
- [x] Handles "already entered" / "entries closed" states

**Phase 3 — Admin auth** ✅ done in code
- [x] `proxy.ts` (Next 16 replacement for `middleware.ts`) protects everything except `/login`, `/giveaway`, `/api/entries`
- [x] `/login` page + `signIn`/`signOut` actions, logout wired in sidebar
- [ ] **YOU:** delete the old `middleware.ts` file (replaced by `proxy.ts`)
- [ ] **YOU:** create an admin user in Supabase (Auth → Users → Add user)

**Phase 4 — Wire dashboard to DB** ✅ done
- [x] `giveaways`, `entries`, `winners`, dashboard home, analytics read from Supabase
- [x] Open/close entries toggle + delete (giveaway table)
- [x] Create-giveaway persistence + banner upload to Storage
- [x] Entry verify/unverify toggle + delete (entries table)

**Phase 5 — Winners** ✅ done in code
- [x] Spinner UI connected to `drawWinners()` RPC, lifetime-safe
- [x] Winner status updates (Pending/Contacted/Claimed/Unclaimed)
- [x] Rule-aware eligibility (migration `0002`): unverified entries eligible when a giveaway doesn't require verification

**Phase 6 — Polish**
- [x] Analytics from real aggregates
- [ ] Email notifications to winners (optional, Supabase + Resend)
- [ ] Rate-limit the public form (Vercel / Supabase edge)

> ⚠️ **Run `supabase/migrations/0002_eligibility_and_storage.sql`** in the SQL editor — it updates `draw_winners` and creates the public `banners` storage bucket.

## 13. Open questions to confirm

- Admin login: **password** or **magic link**?
- Email verification on entries: required for v1, or skip?
- Form hosting: a **route in this app** (`/giveaway`) or an **embed** on `youngtraderviraj.com`?
- Should "multiple entries" ever be allowed, or always one-entry-per-email-per-giveaway?
