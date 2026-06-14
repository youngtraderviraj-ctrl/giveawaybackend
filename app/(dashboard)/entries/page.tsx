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
      <div>
        <h1 className="text-4xl font-extrabold mb-2"><span className="text-gradient">Entries</span></h1>
        <p className="text-muted">View and manage all giveaway entries</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-surface p-5">
          <p className="text-xs text-muted font-medium mb-2">Total Entries</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalEntries}</p>
        </div>
        <div className="card-surface p-5">
          <p className="text-xs text-muted font-medium mb-2">Verified</p>
          <p className="text-2xl font-extrabold text-emerald-500">{verifiedEntries}</p>
        </div>
        <div className="card-surface p-5">
          <p className="text-xs text-muted font-medium mb-2">Pending Verification</p>
          <p className="text-2xl font-extrabold text-amber-500">{unverifiedEntries}</p>
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
        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold text-sm shadow-md shadow-sky-500/20">
          All Giveaways
        </button>
        {giveaways.slice(0, 3).map((giveaway) => (
          <button
            key={giveaway.id}
            className="px-4 py-2 rounded-full bg-white/60 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-sky-400/50 hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-sm"
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
