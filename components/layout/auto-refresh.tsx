'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface AutoRefreshProps {
  /** Polling interval in milliseconds. Defaults to 30s. */
  intervalMs?: number
}

/**
 * Silently re-runs the server components for the current route on an interval,
 * on window focus, and when the tab becomes visible again. Uses a soft
 * router.refresh() so client state and scroll position are preserved.
 */
export function AutoRefresh({ intervalMs = 30_000 }: AutoRefreshProps) {
  const router = useRouter()
  const lastRefresh = useRef(Date.now())

  useEffect(() => {
    const refresh = () => {
      lastRefresh.current = Date.now()
      router.refresh()
    }

    const interval = setInterval(refresh, intervalMs)

    // Refresh when the user returns to the tab/window, but throttle so a quick
    // focus toggle doesn't spam the server.
    const onFocus = () => {
      if (Date.now() - lastRefresh.current > 5_000) refresh()
    }
    const onVisibility = () => {
      if (document.visibilityState === 'visible') onFocus()
    }

    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [router, intervalMs])

  return null
}
