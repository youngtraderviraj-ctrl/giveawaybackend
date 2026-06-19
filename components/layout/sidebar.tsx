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
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-card text-foreground border border-border shadow-sm backdrop-blur hover:text-primary transition-colors"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar backdrop-blur-3xl border-r border-sidebar-border shadow-2xl flex flex-col transition-transform duration-300 md:translate-x-0 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/30">
              YT
            </div>
            <div>
              <h1 className="text-sm font-semibold text-sidebar-foreground">YoungTrader</h1>
              <p className="text-xs text-muted-foreground">Giveaway Manager</p>
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
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-medium shadow-md shadow-primary/25 translate-x-1'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 hover:backdrop-blur-sm'
                }`}
              >
                <Icon size={20} className={isActive ? '' : 'group-hover:scale-110 transition-transform duration-300'} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-sidebar-border/50 space-y-3">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-sidebar-accent/30 border border-sidebar-border/50 backdrop-blur-md">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-sm shadow-md shadow-primary/20">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Admin</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{email || 'Not signed in'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/15 hover:shadow-sm transition-all duration-300 text-sm font-medium disabled:opacity-50"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />}
            <span>{isPending ? 'Signing out…' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
