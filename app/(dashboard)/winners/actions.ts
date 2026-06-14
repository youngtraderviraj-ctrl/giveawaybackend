'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { WinnerStatus } from '@/lib/types'

export async function updateWinnerStatus(id: string, status: WinnerStatus) {
  const supabase = supabaseAdmin()

  const patch: Record<string, unknown> = { status }
  if (status === 'Contacted') patch.contacted_at = new Date().toISOString()
  if (status === 'Claimed') patch.claimed_at = new Date().toISOString()

  const { error } = await supabase.from('winners').update(patch).eq('id', id)
  if (error) return { ok: false as const, error: error.message }

  revalidatePath('/winners')
  return { ok: true as const }
}
