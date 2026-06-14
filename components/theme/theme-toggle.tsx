'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    const root = document.documentElement
    const next = !root.classList.contains('dark')
    root.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {}
    setIsDark(next)
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/60 text-slate-600 transition-all hover:border-sky-400/50 hover:text-sky-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-sky-300"
    >
      {mounted && isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
