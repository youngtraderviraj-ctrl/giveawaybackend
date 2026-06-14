'use client'

import { Bell, Search, AlertCircle } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/theme-toggle'

export function TopNavbar() {
  return (
    <header className="sticky top-0 z-20 w-full bg-white/70 dark:bg-slate-950/50 backdrop-blur-xl border-b border-slate-200/70 dark:border-white/10">
      <div className="flex items-center justify-between h-16 px-4 md:px-8 pl-16 md:pl-8">
        {/* Left side - Search */}
        <div className="flex-1 max-w-md hidden md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search giveaways, entries..."
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-300">System Active</span>
          </div>

          <ThemeToggle />

          {/* Notifications */}
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/60 text-slate-600 transition-all hover:border-sky-400/50 hover:text-sky-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-sky-300">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-950"></span>
          </button>

          {/* User Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:shadow-lg hover:shadow-sky-500/30 transition-shadow">
            AJ
          </div>
        </div>
      </div>
    </header>
  )
}
