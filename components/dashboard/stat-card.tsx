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
  Gift: 'bg-gradient-to-br from-primary to-primary/70 shadow-primary/30',
  Users: 'bg-gradient-to-br from-chart-1 to-chart-1/70 shadow-chart-1/30',
  Trophy: 'bg-gradient-to-br from-chart-5 to-chart-5/70 shadow-chart-5/30',
  BarChart3: 'bg-gradient-to-br from-chart-3 to-chart-3/70 shadow-chart-3/30',
  TrendingUp: 'bg-gradient-to-br from-emerald-500 to-emerald-400 shadow-emerald-500/30',
  TrendingDown: 'bg-gradient-to-br from-rose-500 to-rose-400 shadow-rose-500/30',
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
      className={`group card-interactive p-6 transition-all duration-500 relative overflow-hidden ${className}`}
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500"></div>
      <div className="relative z-10">
        {/* Icon Background */}
        <div className={`inline-flex p-3 rounded-xl ${gradient} text-primary-foreground mb-4 shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300`}>
          <Icon size={24} />
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/80">{value}</h3>
            {trend && trendValue && (
              <div
                className={`flex items-center gap-1 text-xs font-medium mb-1.5 ${
                  trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
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
          {description && <p className="text-xs text-muted-foreground/70">{description}</p>}
        </div>
      </div>
    </div>
  )
}
