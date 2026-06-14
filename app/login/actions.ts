'use server'

import { createSupabaseServerClient } from '@/lib/supabase/auth-server'
import { redirect } from 'next/navigation'

export async function signIn(email: string, password: string) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { ok: false as const, error: error.message }
  return { ok: true as const }
}

export async function signOut() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}
