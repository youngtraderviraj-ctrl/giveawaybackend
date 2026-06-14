'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { GiveawayStatus } from '@/lib/types'

export interface CreateGiveawayInput {
  name: string
  prize: string
  description: string
  winners: number
  multipleEntries: boolean
  emailVerificationRequired: boolean
  lifetimeWinnerRestriction: boolean
  startDate: string // ISO or empty
  endDate: string // ISO or empty
  status: GiveawayStatus
}

export async function createGiveaway(input: CreateGiveawayInput, banner?: File | null) {
  if (!input.name || !input.prize) {
    return { ok: false as const, error: 'Name and prize are required.' }
  }

  const supabase = supabaseAdmin()

  // Optional banner upload to the public "banners" bucket.
  let bannerUrl: string | null = null
  if (banner && banner.size > 0) {
    const ext = banner.name.includes('.') ? banner.name.split('.').pop() : 'png'
    const path = `${crypto.randomUUID()}.${ext}`
    const buffer = Buffer.from(await banner.arrayBuffer())
    const { error: uploadError } = await supabase.storage
      .from('banners')
      .upload(path, buffer, { contentType: banner.type || 'image/png' })
    if (uploadError) return { ok: false as const, error: `Banner upload failed: ${uploadError.message}` }
    bannerUrl = supabase.storage.from('banners').getPublicUrl(path).data.publicUrl
  }

  const { data, error } = await supabase
    .from('giveaways')
    .insert({
      name: input.name,
      prize: input.prize,
      description: input.description || null,
      banner_url: bannerUrl,
      winners_count: Math.max(1, input.winners),
      start_date: input.startDate || null,
      end_date: input.endDate || null,
      status: input.status,
      multiple_entries: input.multipleEntries,
      email_verification: input.emailVerificationRequired,
      lifetime_winner_restrict: input.lifetimeWinnerRestriction,
    })
    .select('id')
    .single()

  if (error) return { ok: false as const, error: error.message }

  revalidatePath('/giveaways')
  revalidatePath('/dashboard')
  return { ok: true as const, id: data.id as string }
}

/** Open or close entries by flipping the giveaway status. */
export async function setGiveawayStatus(id: string, status: GiveawayStatus) {
  const supabase = supabaseAdmin()
  const { error } = await supabase.from('giveaways').update({ status }).eq('id', id)
  if (error) return { ok: false as const, error: error.message }

  revalidatePath('/giveaways')
  revalidatePath('/dashboard')
  return { ok: true as const }
}

export async function deleteGiveaway(id: string) {
  const supabase = supabaseAdmin()
  const { error } = await supabase.from('giveaways').delete().eq('id', id)
  if (error) return { ok: false as const, error: error.message }

  revalidatePath('/giveaways')
  revalidatePath('/dashboard')
  return { ok: true as const }
}
