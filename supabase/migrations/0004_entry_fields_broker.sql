-- ============================================================
-- Entry fields update: WhatsApp number, Broker, MT5/Account ID
-- - rename phone -> whatsapp_number
-- - drop country
-- - add broker (constrained to known brokers)
-- - add account_id (MT5 ID / Account ID)
-- is_verified already exists with default false (kept as-is).
-- Run this in Supabase: SQL Editor -> New query -> paste -> Run
-- ============================================================

-- Rename phone -> whatsapp_number (keeps any existing data)
do $$ begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'entries' and column_name = 'phone'
  ) then
    alter table public.entries rename column phone to whatsapp_number;
  end if;
end $$;

-- Make sure the column exists even on fresh installs
alter table public.entries add column if not exists whatsapp_number text;

-- Drop country
alter table public.entries drop column if exists country;

-- New fields
alter table public.entries add column if not exists broker text;
alter table public.entries add column if not exists account_id text;

-- Constrain broker to the supported set (null allowed for legacy rows)
do $$ begin
  alter table public.entries
    add constraint entries_broker_check
    check (broker is null or broker in ('XM', 'Xellion', 'Exness', 'Delta Exchange', 'Dhan'));
exception when duplicate_object then null; end $$;
