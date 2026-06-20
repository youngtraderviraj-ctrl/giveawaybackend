import { getWinners, getGiveaways } from '@/lib/db'
import { Trophy, Download, Filter } from 'lucide-react'
import { WinnersTable } from '@/components/winners/winners-table'

export const dynamic = 'force-dynamic'

export default async function WinnersPage() {
  const [winners, giveaways] = await Promise.all([getWinners(), getGiveaways()])
  const giveawayNames = new Map(giveaways.map((g) => [g.id, g.name]))
  const claimedWinners = winners.filter((w) => w.status === 'Claimed').length
  const contactedWinners = winners.filter((w) => w.status === 'Contacted').length
  const pendingWinners = winners.filter((w) => w.status === 'Pending').length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 mb-4 relative z-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 drop-shadow-sm tracking-tight">Winners</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">Manage and track all giveaway winners</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-surface p-5 hover:bg-muted/60 transition-colors">
          <p className="text-sm text-muted-foreground font-medium mb-2">Total Winners</p>
          <p className="text-2xl font-bold text-foreground">{winners.length}</p>
        </div>
        <div className="card-surface p-5 hover:bg-muted/60 transition-colors">
          <p className="text-sm text-muted-foreground font-medium mb-2">Claimed</p>
          <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-chart-2 to-chart-2/70">{claimedWinners}</p>
        </div>
        <div className="card-surface p-5 hover:bg-muted/60 transition-colors">
          <p className="text-sm text-muted-foreground font-medium mb-2">Contacted</p>
          <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-chart-1 to-chart-1/70">{contactedWinners}</p>
        </div>
        <div className="card-surface p-5 hover:bg-muted/60 transition-colors">
          <p className="text-sm text-muted-foreground font-medium mb-2">Pending</p>
          <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-chart-5 to-chart-5/70">{pendingWinners}</p>
        </div>
      </div>

      {/* Filters */}
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

      {/* Winners Table */}
      <WinnersTable winners={winners} giveawayNames={giveawayNames} />
    </div>
  )
}
