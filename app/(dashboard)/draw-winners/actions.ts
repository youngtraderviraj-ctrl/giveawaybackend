'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { mapWinner, type WinnerRow } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export interface EligibleSummary {
  giveawayId: string
  eligibleCount: number
}

/** Count entries eligible to win for a giveaway (never won). */
export async function getEligibleCount(giveawayId: string): Promise<number> {
  const supabase = supabaseAdmin()

  const { data: entries, error } = await supabase
    .from('entries')
    .select('email')
    .eq('giveaway_id', giveawayId)
  if (error) throw new Error(error.message)

  const { data: wonRows } = await supabase.from('winners').select('email')
  const wonEmails = new Set((wonRows ?? []).map((w) => w.email.toLowerCase()))

  return (entries ?? []).filter((e) => !wonEmails.has(e.email.toLowerCase())).length
}

/** Draw winners server-side via the draw_winners RPC (fair + lifetime-safe). */
export async function drawWinners(giveawayId: string, count: number) {
  const supabase = supabaseAdmin()

  const { data, error } = await supabase.rpc('draw_winners', {
    p_giveaway_id: giveawayId,
    p_count: count,
  })
  if (error) throw new Error(error.message)

  // enrich with entrant names for display
  const rows = (data ?? []) as WinnerRow[]
  const entryIds = rows.map((r) => r.entry_id)
  const { data: entries } = await supabase
    .from('entries')
    .select('id, name, country')
    .in('id', entryIds.length ? entryIds : ['00000000-0000-0000-0000-000000000000'])

  const byId = new Map((entries ?? []).map((e) => [e.id, e]))

  revalidatePath('/winners')
  revalidatePath('/draw-winners')

  return rows.map((r) => {
    const e = byId.get(r.entry_id)
    return mapWinner(r, e?.name ?? '', e?.country ?? '')
  })
}
