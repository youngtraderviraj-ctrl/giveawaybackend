'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function setEntryVerified(id: string, verified: boolean) {
  const supabase = supabaseAdmin()
  const { error } = await supabase.from('entries').update({ is_verified: verified }).eq('id', id)
  if (error) return { ok: false as const, error: error.message }
  revalidatePath('/entries')
  return { ok: true as const }
}

export async function deleteEntry(id: string) {
  const supabase = supabaseAdmin()
  const { error } = await supabase.from('entries').delete().eq('id', id)
  if (error) return { ok: false as const, error: error.message }
  revalidatePath('/entries')
  return { ok: true as const }
}
