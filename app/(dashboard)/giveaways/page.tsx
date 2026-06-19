import { getGiveaways } from '@/lib/db'
import { GiveawayTable } from '@/components/giveaways/giveaway-table'
import { Plus, Filter, Download } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function GiveawaysPage() {
  const giveaways = await getGiveaways()
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 mb-4 relative z-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 drop-shadow-sm tracking-tight">Giveaways</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">Manage and create giveaway campaigns</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          <button className="btn-ghost">
            <Filter size={18} />
            <span>Filter</span>
          </button>
          <button className="btn-ghost">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>

        <Link href="/giveaways/create" className="btn-primary whitespace-nowrap">
          <Plus size={18} />
          <span>New Giveaway</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-surface p-5 hover:bg-muted/60 transition-colors">
          <p className="text-sm text-muted-foreground font-medium mb-2">Total Giveaways</p>
          <p className="text-2xl font-bold text-foreground">{giveaways.length}</p>
        </div>
        <div className="card-surface p-5 hover:bg-muted/60 transition-colors">
          <p className="text-sm text-muted-foreground font-medium mb-2">Active</p>
          <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-chart-2 to-chart-2/70">
            {giveaways.filter((g) => g.status === 'Live').length}
          </p>
        </div>
        <div className="card-surface p-5 hover:bg-muted/60 transition-colors">
          <p className="text-sm text-muted-foreground font-medium mb-2">Total Entries</p>
          <p className="text-2xl font-bold text-foreground">
            {giveaways.reduce((sum, g) => sum + g.totalEntries, 0).toLocaleString()}
          </p>
        </div>
        <div className="card-surface p-5 hover:bg-muted/60 transition-colors">
          <p className="text-sm text-muted-foreground font-medium mb-2">Total Winners</p>
          <p className="text-2xl font-bold text-foreground">
            {giveaways.reduce((sum, g) => sum + g.winners, 0)}
          </p>
        </div>
      </div>

      {/* Giveaways Table */}
      <GiveawayTable giveaways={giveaways} />
    </div>
  )
}
