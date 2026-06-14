'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import type { WinnerStatus } from '@/lib/types'
import { updateWinnerStatus } from '@/app/(dashboard)/winners/actions'

const STATUSES: WinnerStatus[] = ['Pending', 'Contacted', 'Claimed', 'Unclaimed']

const statusColors: Record<WinnerStatus, string> = {
  Pending: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30',
  Contacted: 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/30',
  Claimed: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
  Unclaimed: 'bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-500/30',
}

interface WinnerStatusSelectProps {
  winnerId: string
  status: WinnerStatus
}

export function WinnerStatusSelect({ winnerId, status }: WinnerStatusSelectProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as WinnerStatus
    startTransition(async () => {
      await updateWinnerStatus(winnerId, next)
      router.refresh()
    })
  }

  return (
    <select
      value={status}
      onChange={onChange}
      disabled={isPending}
      className={`rounded-full border px-3 py-1 text-xs font-semibold outline-none disabled:opacity-50 ${statusColors[status]}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">
          {s}
        </option>
      ))}
    </select>
  )
}
