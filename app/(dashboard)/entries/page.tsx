import { getEntries, getGiveaways } from '@/lib/db'
import { EntriesTable } from '@/components/entries/entries-table'
import { Search, Download, Filter } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function EntriesPage() {
  const [entries, giveaways] = await Promise.all([getEntries(), getGiveaways()])
  const totalEntries = entries.length
  const verifiedEntries = entries.filter((e) => e.isVerified).length
  const unverifiedEntries = totalEntries - verifiedEntries

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 mb-4 relative z-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 drop-shadow-sm tracking-tight">Entries</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">View and manage all giveaway entries</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-surface p-5 hover:bg-muted/60 transition-colors">
          <p className="text-sm text-muted-foreground font-medium mb-2">Total Entries</p>
          <p className="text-2xl font-bold text-foreground">{totalEntries}</p>
        </div>
        <div className="card-surface p-5 hover:bg-muted/60 transition-colors">
          <p className="text-sm text-muted-foreground font-medium mb-2">Verified</p>
          <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-chart-2 to-chart-2/70">{verifiedEntries}</p>
        </div>
        <div className="card-surface p-5 hover:bg-muted/60 transition-colors">
          <p className="text-sm text-muted-foreground font-medium mb-2">Pending Verification</p>
          <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-chart-5 to-chart-5/70">{unverifiedEntries}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search entries by name, email..."
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button className="btn-ghost">
            <Filter size={18} />
            <span>Filter</span>
          </button>
          <button className="btn-ghost">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Giveaway Filter */}
      <div className="flex gap-2 flex-wrap">
        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium text-sm shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] hover:scale-105 transition-all">
          All Giveaways
        </button>
        {giveaways.slice(0, 3).map((giveaway) => (
          <button
            key={giveaway.id}
            className="px-4 py-2 rounded-full bg-card/60 backdrop-blur-md text-foreground border border-border/50 hover:border-primary/50 hover:text-primary transition-all text-sm shadow-sm"
          >
            {giveaway.name}
          </button>
        ))}
      </div>

      {/* Entries Table */}
      <EntriesTable entries={entries} />
    </div>
  )
}
