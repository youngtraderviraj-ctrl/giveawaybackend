'use client'

import { Giveaway } from '@/lib/types'
import { Trash2, Play, Square, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { setGiveawayStatus, deleteGiveaway } from '@/app/(dashboard)/giveaways/actions'
import { formatDate } from '@/lib/utils'

interface GiveawayTableProps {
  giveaways: Giveaway[]
}

export function GiveawayTable({ giveaways }: GiveawayTableProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)

  const toggleStatus = (g: Giveaway) => {
    const next = g.status === 'Live' ? 'Closed' : 'Live'
    setBusyId(g.id)
    startTransition(async () => {
      await setGiveawayStatus(g.id, next)
      setBusyId(null)
      router.refresh()
    })
  }

  const handleDelete = (g: Giveaway) => {
    if (!confirm(`Delete "${g.name}"? This also removes its entries and winners.`)) return
    setBusyId(g.id)
    startTransition(async () => {
      await deleteGiveaway(g.id)
      setBusyId(null)
      router.refresh()
    })
  }

  const statusColors = {
    Live: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
    Scheduled: 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/30',
    Draft: 'bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-500/30',
    Closed: 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30',
  }

  return (
    <div className="card-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200/70 dark:border-white/10 bg-slate-50/60 dark:bg-white/5">
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Giveaway
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Prize
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Entries
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Winners
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {giveaways.map((giveaway, idx) => (
              <tr
                key={giveaway.id}
                className="border-b border-slate-200/60 dark:border-white/5 hover:bg-sky-500/5 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                      {giveaway.name}
                    </p>
                    <p className="text-xs text-faint">ID: {giveaway.id}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">{giveaway.prize}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-900 dark:text-white font-semibold">
                    {giveaway.totalEntries.toLocaleString()}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-900 dark:text-white font-semibold">{giveaway.winners}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 text-sm">
                    <p className="text-slate-700 dark:text-slate-200">
                      {formatDate(giveaway.startDate)}
                    </p>
                    <p className="text-faint">
                      to {formatDate(giveaway.endDate)}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[giveaway.status]}`}
                  >
                    {giveaway.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {giveaway.status === 'Live' ? (
                      <button
                        onClick={() => toggleStatus(giveaway)}
                        disabled={isPending && busyId === giveaway.id}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                        title="Close entries"
                      >
                        {isPending && busyId === giveaway.id ? <Loader2 size={16} className="animate-spin" /> : <Square size={16} />}
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleStatus(giveaway)}
                        disabled={isPending && busyId === giveaway.id}
                        className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-500/10 transition-colors disabled:opacity-50"
                        title="Open entries (set Live)"
                      >
                        {isPending && busyId === giveaway.id ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(giveaway)}
                      disabled={isPending && busyId === giveaway.id}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
