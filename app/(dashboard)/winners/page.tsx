import { getWinners, getGiveaways } from '@/lib/db'
import { Trophy, Download, Filter } from 'lucide-react'
import { WinnerStatusSelect } from '@/components/winners/winner-status-select'

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
      <div className="card-surface overflow-hidden border-primary/10 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-muted/40 backdrop-blur-sm">
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Winner Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Giveaway
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Prize
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Won Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {winners.map((winner, idx) => (
                <tr
                  key={winner.id}
                  className="border-b border-border/30 hover:bg-muted/40 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md shadow-primary/20 group-hover:scale-110 transition-transform">
                        {(winner.name || winner.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{winner.name || winner.email}</p>
                        <p className="text-xs text-muted-foreground">{winner.country}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">{winner.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-foreground font-medium">{giveawayNames.get(winner.giveawayId) ?? '—'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-foreground/80">{winner.prize}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">
                      {new Date(winner.wonDate).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 relative z-20">
                    <WinnerStatusSelect winnerId={winner.id} status={winner.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
