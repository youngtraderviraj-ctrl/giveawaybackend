import { ActivityFeedItem } from '@/lib/types'
import * as LucideIcons from 'lucide-react'

interface ActivityFeedProps {
  activities: ActivityFeedItem[]
}

const iconMap: Record<string, React.ComponentType<any>> = {
  UserPlus: LucideIcons.UserPlus,
  Gift: LucideIcons.Gift,
  Trophy: LucideIcons.Trophy,
  XCircle: LucideIcons.XCircle,
  Activity: LucideIcons.Activity,
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="card-surface p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Recent Activity</h3>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = iconMap[activity.icon || 'Activity'] || LucideIcons.Activity
          const isLast = index === activities.length - 1

          return (
            <div key={activity.id} className="flex gap-4">
              {/* Timeline Line */}
              {!isLast && (
                <div className="absolute left-[calc(50%+20px)] top-[calc(100%+8px)] w-0.5 h-8 bg-border to-transparent" />
              )}

              {/* Icon Circle */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <Icon size={18} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground/70 whitespace-nowrap flex-shrink-0">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* View All Link */}
      <button className="w-full mt-6 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors text-center border-t border-border pt-6">
        View All Activity
      </button>
    </div>
  )
}
