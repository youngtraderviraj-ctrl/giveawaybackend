-- ============================================================
-- Remove email verification requirement from winner drawing
-- Run this in Supabase: SQL Editor → New query → paste → Run
-- ============================================================

-- Update draw_winners function to NOT require is_verified
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
      -- REMOVED: and e.is_verified = true
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

-- ============================================================
-- CLEAR ALL DATA (optional - run if you want to reset)
-- ============================================================

-- Delete all winners
-- delete from public.winners;

-- Delete all entries
-- delete from public.entries;
