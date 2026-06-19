import { getGiveaways, getStats, getRecentActivity } from '@/lib/db'
import { HeroCard } from '@/components/dashboard/hero-card'
import { StatCard } from '@/components/dashboard/stat-card'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [giveaways, stats, activities] = await Promise.all([
    getGiveaways(),
    getStats(),
    getRecentActivity(),
  ])
  const activeGiveaway = giveaways.find((g) => g.status === 'Live') || giveaways[0]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 mb-4 relative z-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 drop-shadow-sm tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Welcome back! Here&apos;s an overview of your giveaway platform.
        </p>
      </div>

      {/* Hero Card - Active Giveaway */}
      {activeGiveaway && <HeroCard giveaway={activeGiveaway} />}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Giveaways"
          value={stats.totalGiveaways}
          description="All time giveaways"
          icon="Gift"
        />
        <StatCard
          title="Total Entries"
          value={stats.totalEntries.toLocaleString()}
          description="Across all giveaways"
          icon="Users"
        />
        <StatCard
          title="Total Winners"
          value={stats.totalWinners}
          description="Giveaway winners"
          icon="Trophy"
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats.conversionRate}%`}
          description="Entry to winner ratio"
          icon="BarChart3"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Recent Giveaways */}
        <div className="lg:col-span-2">
          <div className="card-surface p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Recent Giveaways</h3>
              <Link
                href="/giveaways"
                className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
              >
                View All
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="space-y-3">
              {giveaways.slice(0, 4).map((giveaway) => {
                const statusColors = {
                  Live: 'bg-primary/10 text-primary border-primary/20',
                  Scheduled: 'bg-secondary text-secondary-foreground border-secondary',
                  Draft: 'bg-muted text-muted-foreground border-border',
                  Closed: 'bg-destructive/10 text-destructive border-destructive/20',
                }

                return (
                  <Link
                    key={giveaway.id}
                    href={`/giveaways`}
                    className="group p-4 rounded-xl card-inset hover:border-primary/50 hover:bg-muted/60 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center justify-between gap-4 relative z-10">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                            {giveaway.name}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${statusColors[giveaway.status]}`}
                          >
                            {giveaway.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {giveaway.totalEntries.toLocaleString()} entries • {giveaway.winners}{' '}
                          {giveaway.winners === 1 ? 'winner' : 'winners'}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium text-foreground">{giveaway.prize}</p>
                        <p className="text-xs text-muted-foreground/70">
                          {new Date(giveaway.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar - Activity Feed */}
        <div className="lg:col-span-1">
          <ActivityFeed activities={activities} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/giveaways/create"
          className="group card-interactive p-6 cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-150 group-hover:bg-primary/20"></div>
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1.5 relative z-10 text-lg">
            Create Giveaway
          </h4>
          <p className="text-xs text-muted-foreground">Launch a new giveaway campaign</p>
        </Link>

        <Link
          href="/draw-winners"
          className="group card-interactive p-6 cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-150 group-hover:bg-primary/20"></div>
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] transition-all duration-300">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1.5 relative z-10 text-lg">
            Draw Winners
          </h4>
          <p className="text-xs text-muted-foreground">Run the lottery wheel</p>
        </Link>

        <Link
          href="/analytics"
          className="group card-interactive p-6 cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-150 group-hover:bg-primary/20"></div>
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] transition-all duration-300">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1.5 relative z-10 text-lg">
            Analytics
          </h4>
          <p className="text-xs text-muted-foreground">View detailed metrics</p>
        </Link>
      </div>
    </div>
  )
}
