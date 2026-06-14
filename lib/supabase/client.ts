import { createBrowserClient } from '@supabase/ssr'

/**
 * Browser Supabase client (uses the public anon key).
 * Safe to use in client components and the public entry form.
 * All access is constrained by Row Level Security.
 */
export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
