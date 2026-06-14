import { createClient } from '@supabase/supabase-js'

/**
 * Server-side anon client for public reads in server components
 * (e.g. fetching the current Live giveaway for the public form).
 * Constrained by Row Level Security.
 */
export function supabaseServerAnon() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  )
}
