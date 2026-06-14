import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client (uses the service_role key).
 * SERVER ONLY. This client bypasses Row Level Security, so it must
 * never be imported into a client component or shipped to the browser.
 *
 * Use it inside route handlers and server actions for admin tasks:
 * creating giveaways, opening/closing entries, drawing winners, etc.
 */
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
