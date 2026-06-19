'use client'

import { Bell, Search, AlertCircle } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/theme-toggle'

export function TopNavbar() {
  return (
    <header className="sticky top-0 z-20 w-full bg-background/40 backdrop-blur-2xl border-b border-border/30 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between h-16 px-4 md:px-8 pl-16 md:pl-8">
        {/* Left side - Search */}
        <div className="flex-1 max-w-md hidden md:flex">
          <div className="relative w-full group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search giveaways, entries..."
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md shadow-[0_0_15px_rgba(var(--primary),0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-[0_0_5px_rgba(var(--primary),1)]"></span>
            </span>
            <span className="text-xs font-semibold text-primary tracking-wide uppercase">System Active</span>
          </div>

          <div className="h-8 w-px bg-border/50 mx-1 hidden sm:block"></div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
