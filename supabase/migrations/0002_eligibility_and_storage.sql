-- ============================================================
-- 0002: rule-aware draw eligibility + banner storage
-- Run this in Supabase SQL editor AFTER 0001.
-- ============================================================

-- ---------- Rule-aware winner draw ----------
-- An entry is eligible if it has never won (lifetime rule) AND either:
--   * it is verified, OR
--   * its giveaway does not require email verification.
create or replace function public.draw_winners(p_giveaway_id uuid, p_count int)
returns setof public.winners
language plpgsql
security definer
set search_path = public
as $$
declare
  v_prize text;
  v_requires_verification boolean;
begin
  select prize, email_verification
    into v_prize, v_requires_verification
    from public.giveaways
   where id = p_giveaway_id;

  return query
  with eligible as (
    select e.*
    from public.entries e
    where e.giveaway_id = p_giveaway_id
      and (e.is_verified = true or v_requires_verification = false)
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

-- ---------- Banner storage bucket (public) ----------
insert into storage.buckets (id, name, public)
values ('banners', 'banners', true)
on conflict (id) do nothing;
