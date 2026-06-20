import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Paths that do NOT require authentication.
const PUBLIC_PATHS = ['/login', '/giveaway', '/api/entries', '/api/winners', '/api/verify-xm']

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Use getClaims() instead of getUser(): when the project uses asymmetric
  // JWT signing keys, the token is verified LOCALLY with no network call,
  // so middleware no longer adds a Supabase round-trip (and timeout risk)
  // to every request. Falls back to no-session on any failure.
  let authenticated = false
  try {
    const { data } = await supabase.auth.getClaims()
    authenticated = !!data?.claims
  } catch {
    // Supabase was briefly unreachable (e.g. ConnectTimeoutError).
    // Don't crash the request; treat as unauthenticated and let the
    // redirect logic below send protected routes to /login.
    authenticated = false
  }

  const { pathname } = request.nextUrl

  // Unauthenticated user hitting a protected route → send to /login
  if (!authenticated && !isPublic(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Authenticated user hitting /login → send to dashboard
  if (authenticated && pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  // Run on everything except Next internals and static asset files.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
}
