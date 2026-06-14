import React from 'react'
import * as LucideIcons from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: string
  trend?: 'up' | 'down'
  trendValue?: string
  className?: string
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Gift: LucideIcons.Gift,
  Users: LucideIcons.Users,
  Trophy: LucideIcons.Trophy,
  BarChart3: LucideIcons.BarChart3,
  TrendingUp: LucideIcons.TrendingUp,
  TrendingDown: LucideIcons.TrendingDown,
}

const gradientMap: Record<string, string> = {
  Gift: 'from-sky-500 to-blue-500',
  Users: 'from-cyan-500 to-sky-500',
  Trophy: 'from-emerald-500 to-teal-500',
  BarChart3: 'from-violet-500 to-fuchsia-500',
  TrendingUp: 'from-emerald-500 to-green-500',
  TrendingDown: 'from-rose-500 to-red-500',
}

export function StatCard({
  title,
  value,
  description,
  icon = 'Gift',
  trend,
  trendValue,
  className = '',
}: StatCardProps) {
  const Icon = iconMap[icon] || LucideIcons.Activity
  const gradient = gradientMap[icon] || 'from-sky-500 to-emerald-500'

  return (
    <div
      className={`group card-interactive p-6 transition-all duration-300 ${className}`}
    >
      <div className="relative">
        {/* Icon Background */}
        <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${gradient} text-white mb-4 shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform`}>
          <Icon size={24} />
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-muted">{title}</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</h3>
            {trend && trendValue && (
              <div
                className={`flex items-center gap-1 text-xs font-semibold mb-1.5 ${
                  trend === 'up' ? 'text-emerald-500' : 'text-rose-500'
                }`}
              >
                {trend === 'up' ? (
                  <LucideIcons.TrendingUp size={14} />
                ) : (
                  <LucideIcons.TrendingDown size={14} />
                )}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          {description && <p className="text-xs text-faint">{description}</p>}
        </div>
      </div>
    </div>
  )
}
