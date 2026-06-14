'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAVIGATION_MENU } from '@/lib/constants'
import * as LucideIcons from 'lucide-react'
import { LogOut, Menu, X, Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { signOut } from '@/app/login/actions'

const iconMap: Record<string, React.ComponentType<any>> = {
  LayoutDashboard: LucideIcons.LayoutDashboard,
  Gift: LucideIcons.Gift,
  Users: LucideIcons.Users,
  Trophy: LucideIcons.Trophy,
  BarChart3: LucideIcons.BarChart3,
  Settings: LucideIcons.Settings,
}

interface SidebarProps {
  email?: string
}

export function Sidebar({ email = '' }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await signOut()
    })
  }

  const initials = email ? email.slice(0, 2).toUpperCase() : 'YT'

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-xl bg-white/80 text-slate-700 border border-slate-200 shadow-sm backdrop-blur hover:text-sky-600 transition-colors dark:bg-slate-900/70 dark:text-slate-200 dark:border-white/10"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white/70 dark:bg-slate-950/60 backdrop-blur-xl border-r border-slate-200/70 dark:border-white/10 flex flex-col transition-transform duration-300 md:translate-x-0 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-200/70 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-500/30">
              YT
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-gradient">YoungTrader</h1>
              <p className="text-xs text-muted">Giveaway Manager</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {NAVIGATION_MENU.map((item) => {
            const Icon = iconMap[item.icon] || LucideIcons.Activity
            const isActive =
              item.exact ? pathname === item.href : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold shadow-lg shadow-sky-500/25'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5'
                }`}
              >
                <Icon size={20} className={isActive ? '' : 'group-hover:scale-110 transition-transform'} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-200/70 dark:border-white/10 space-y-3">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl card-inset">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-sky-500/30">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">Admin</p>
              <p className="text-xs text-muted truncate">{email || 'Not signed in'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
            <span>{isPending ? 'Signing out…' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
