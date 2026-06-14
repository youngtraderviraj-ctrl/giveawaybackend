import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Cookie-aware Supabase client for server components and server actions.
 * Reads/writes the auth session cookies so admin auth state is available
 * across the dashboard.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component — safe to ignore; middleware
            // refreshes the session cookies on navigation.
          }
        },
      },
    }
  )
}

/** Returns the currently authenticated admin user, or null. */
export async function getAuthUser() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
