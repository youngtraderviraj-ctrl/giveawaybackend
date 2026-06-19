import { getAnalytics } from '@/lib/db'
import { TrendingUp, Users, Gift, Globe } from 'lucide-react'

export const dynamic = 'force-dynamic'

const SOURCE_COLORS = ['#0ea5e9', '#6366f1', '#10b981', '#06b6d4', '#f59e0b', '#ec4899']

export default async function AnalyticsPage() {
  const analytics = await getAnalytics()
  const maxEntries = Math.max(1, ...analytics.dailyEntries.map((d) => d.entries))
  const maxGiveawayEntries = Math.max(1, ...analytics.giveawayPerformance.map((g) => g.entries))
  const peak = Math.max(0, ...analytics.dailyEntries.map((d) => d.entries))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 mb-4 relative z-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 drop-shadow-sm tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">Visualize your giveaway performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-surface p-5 hover:bg-muted/60 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-primary" />
            <p className="text-sm text-muted-foreground font-medium">Total Entries</p>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {analytics.totalEntries.toLocaleString()}
          </p>
        </div>

        <div className="card-surface p-5 hover:bg-muted/60 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Gift size={16} className="text-chart-2" />
            <p className="text-sm text-muted-foreground font-medium">Total Winners</p>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {analytics.totalWinners.toLocaleString()}
          </p>
        </div>

        <div className="card-surface p-5 hover:bg-muted/60 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-chart-3" />
            <p className="text-sm text-muted-foreground font-medium">Conversion Rate</p>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {analytics.conversionRate}%
          </p>
        </div>

        <div className="card-surface p-5 hover:bg-muted/60 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={16} className="text-chart-4" />
            <p className="text-sm text-muted-foreground font-medium">Countries</p>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {analytics.countriesCount}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Entries Chart */}
        <div className="card-surface p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Daily Entries Trend</h3>

          <div className="space-y-6">
            {/* Simple bar chart */}
            <div className="flex items-end justify-between gap-2 h-48">
              {analytics.dailyEntries.map((data, idx) => {
                const height = (data.entries / maxEntries) * 100
                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-primary/80 to-primary/40 hover:from-primary hover:to-primary/60 transition-all group-hover:opacity-100"
                      style={{ height: `${Math.max(height, 2)}%` }}
                      title={`${data.date}: ${data.entries} entries`}
                    />
                  </div>
                )
              })}
            </div>

            {/* Labels */}
            <div className="flex justify-between text-xs text-muted">
              <span>{analytics.dailyEntries[0]?.date}</span>
              <span>{analytics.dailyEntries[Math.floor(analytics.dailyEntries.length / 2)]?.date}</span>
              <span>{analytics.dailyEntries[analytics.dailyEntries.length - 1]?.date}</span>
            </div>

            <p className="text-sm text-muted">Peak: {peak} entries</p>
          </div>
        </div>

        {/* Giveaway Performance */}
        <div className="card-surface p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Giveaway Performance</h3>

          <div className="space-y-4">
            {analytics.giveawayPerformance.length === 0 && (
              <p className="text-sm text-muted">No entries yet.</p>
            )}
            {analytics.giveawayPerformance.map((giveaway) => {
              const percentage = (giveaway.entries / maxGiveawayEntries) * 100
              return (
                <div key={giveaway.name}>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {giveaway.name}
                    </p>
                    <span className="text-xs text-primary font-semibold">
                      {giveaway.entries}
                    </span>
                  </div>
                  <div className="w-full card-inset rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="card-surface p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Geographic Distribution</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analytics.countryData.length === 0 && (
            <p className="text-sm text-muted">No entries yet.</p>
          )}
          {analytics.countryData.map((country) => (
            <div
              key={country.country}
              className="card-inset p-4 hover:border-primary/50 transition-colors cursor-pointer"
            >
              <p className="text-sm font-semibold text-foreground mb-2">{country.country}</p>
              <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/80 mb-1">
                {country.entries.toLocaleString()}
              </p>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/60"
                  style={{ width: `${country.percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{country.percentage}% of total</p>
            </div>
          ))}
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="card-surface p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Traffic Sources</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {analytics.sources.length === 0 && (
            <p className="text-sm text-muted">No entries yet.</p>
          )}
          {analytics.sources.map((item, idx) => {
            const color = SOURCE_COLORS[idx % SOURCE_COLORS.length]
            return (
              <div key={item.source} className="card-inset p-4">
                <p className="text-sm text-muted font-medium mb-2">{item.source}</p>
                <p className="text-2xl font-extrabold mb-3" style={{ color }}>
                  {item.entries.toLocaleString()}
                </p>
                <div
                  className="h-1.5 rounded-full"
                  style={{ backgroundColor: color, opacity: 0.35 }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
