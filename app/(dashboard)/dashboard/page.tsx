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
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold"><span className="text-gradient">Dashboard</span></h1>
        <p className="text-muted">
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
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Giveaways</h3>
              <Link
                href="/giveaways"
                className="flex items-center gap-1 text-sm text-sky-600 dark:text-sky-400 hover:text-emerald-500 transition-colors font-semibold"
              >
                View All
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="space-y-3">
              {giveaways.slice(0, 4).map((giveaway) => {
                const statusColors = {
                  Live: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
                  Scheduled: 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/30',
                  Draft: 'bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-500/30',
                  Closed: 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30',
                }

                return (
                  <Link
                    key={giveaway.id}
                    href={`/giveaways`}
                    className="group p-4 rounded-2xl card-inset hover:border-sky-400/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate">
                            {giveaway.name}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap ${statusColors[giveaway.status]}`}
                          >
                            {giveaway.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted">
                          {giveaway.totalEntries.toLocaleString()} entries • {giveaway.winners}{' '}
                          {giveaway.winners === 1 ? 'winner' : 'winners'}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{giveaway.prize}</p>
                        <p className="text-xs text-faint">
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
          className="group card-interactive p-6 cursor-pointer"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
          <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mb-1">
            Create Giveaway
          </h4>
          <p className="text-xs text-muted">Launch a new giveaway campaign</p>
        </Link>

        <Link
          href="/draw-winners"
          className="group card-interactive p-6 cursor-pointer"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <svg
                className="w-5 h-5"
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
          <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1">
            Draw Winners
          </h4>
          <p className="text-xs text-muted">Run the lottery wheel</p>
        </Link>

        <Link
          href="/analytics"
          className="group card-interactive p-6 cursor-pointer"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
              <svg
                className="w-5 h-5"
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
          <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-1">
            Analytics
          </h4>
          <p className="text-xs text-muted">View detailed metrics</p>
        </Link>
      </div>
    </div>
  )
}
