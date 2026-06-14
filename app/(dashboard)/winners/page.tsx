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
      <div>
        <h1 className="text-4xl font-extrabold mb-2"><span className="text-gradient">Winners</span></h1>
        <p className="text-muted">Manage and track all giveaway winners</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-surface p-5">
          <p className="text-xs text-muted font-medium mb-2">Total Winners</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{winners.length}</p>
        </div>
        <div className="card-surface p-5">
          <p className="text-xs text-muted font-medium mb-2">Claimed</p>
          <p className="text-2xl font-extrabold text-emerald-500">{claimedWinners}</p>
        </div>
        <div className="card-surface p-5">
          <p className="text-xs text-muted font-medium mb-2">Contacted</p>
          <p className="text-2xl font-extrabold text-sky-500">{contactedWinners}</p>
        </div>
        <div className="card-surface p-5">
          <p className="text-xs text-muted font-medium mb-2">Pending</p>
          <p className="text-2xl font-extrabold text-amber-500">{pendingWinners}</p>
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
      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/70 dark:border-white/10 bg-slate-50/60 dark:bg-white/5">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Winner Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Giveaway
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Prize
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Won Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {winners.map((winner, idx) => (
                <tr
                  key={winner.id}
                  className="border-b border-slate-200/60 dark:border-white/5 hover:bg-sky-500/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-sky-500/20">
                        {(winner.name || winner.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">{winner.name || winner.email}</p>
                        <p className="text-xs text-muted">{winner.country}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted">{winner.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-900 dark:text-white font-medium">{giveawayNames.get(winner.giveawayId) ?? '—'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-700 dark:text-slate-200">{winner.prize}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted">
                      {new Date(winner.wonDate).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
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
