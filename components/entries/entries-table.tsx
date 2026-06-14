'use client'

import { Entry } from '@/lib/types'
import { Trash2, Check, X, Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setEntryVerified, deleteEntry } from '@/app/(dashboard)/entries/actions'

interface EntriesTableProps {
  entries: Entry[]
}

export function EntriesTable({ entries }: EntriesTableProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [selectedEntries, setSelectedEntries] = useState<string[]>([])

  const toggleVerified = (entry: Entry) => {
    setBusyId(entry.id)
    startTransition(async () => {
      await setEntryVerified(entry.id, !entry.isVerified)
      setBusyId(null)
      router.refresh()
    })
  }

  const handleDelete = (entry: Entry) => {
    if (!confirm(`Delete entry from ${entry.name}?`)) return
    setBusyId(entry.id)
    startTransition(async () => {
      await deleteEntry(entry.id)
      setBusyId(null)
      router.refresh()
    })
  }

  const toggleEntrySelection = (id: string) => {
    setSelectedEntries((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedEntries.length === entries.length) {
      setSelectedEntries([])
    } else {
      setSelectedEntries(entries.map((e) => e.id))
    }
  }

  return (
    <div className="card-surface overflow-hidden">
      {selectedEntries.length > 0 && (
        <div className="bg-sky-500/10 border-b border-sky-500/30 px-6 py-3 flex items-center justify-between">
          <span className="text-sm text-sky-600 dark:text-sky-300 font-semibold">
            {selectedEntries.length} selected
          </span>
          <div className="flex gap-3">
            <button className="px-3 py-1 text-xs font-semibold text-sky-600 dark:text-sky-300 hover:text-emerald-500 transition-colors">
              Export
            </button>
            <button className="px-3 py-1 text-xs font-semibold text-rose-500 hover:text-rose-400 transition-colors">
              Delete
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200/70 dark:border-white/10 bg-slate-50/60 dark:bg-white/5">
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedEntries.length === entries.length && entries.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-sky-500 accent-sky-500"
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Entry Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Verified
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => (
              <tr
                key={entry.id}
                className={`border-b border-slate-200/60 dark:border-white/5 hover:bg-sky-500/5 transition-colors ${
                  selectedEntries.includes(entry.id) ? 'bg-sky-500/5' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedEntries.includes(entry.id)}
                    onChange={() => toggleEntrySelection(entry.id)}
                    className="w-4 h-4 rounded border-slate-300 text-sky-500 accent-sky-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{entry.name}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-muted">{entry.email}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-muted">{entry.phone}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-700 dark:text-slate-200">{entry.country}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-muted">
                    {new Date(entry.entryDate).toLocaleDateString()}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleVerified(entry)}
                    disabled={isPending && busyId === entry.id}
                    title={entry.isVerified ? 'Click to mark unverified' : 'Click to verify'}
                    className="flex items-center gap-1 text-xs font-semibold disabled:opacity-50"
                  >
                    {isPending && busyId === entry.id ? (
                      <Loader2 size={16} className="animate-spin text-slate-400" />
                    ) : entry.isVerified ? (
                      <span className="flex items-center gap-1 text-emerald-500">
                        <Check size={16} />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-500">
                        <X size={16} />
                        Pending
                      </span>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                    {entry.source}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleDelete(entry)}
                      disabled={isPending && busyId === entry.id}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
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

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/70 dark:border-white/10 bg-slate-50/60 dark:bg-white/5">
        <span className="text-xs text-muted">
          Showing {entries.length} of {entries.length} entries
        </span>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm font-medium text-muted hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
            Previous
          </button>
          <button className="px-3 py-1 text-sm font-medium text-muted hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
