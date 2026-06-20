'use client'

import { Entry } from '@/lib/types'
import { Trash2, Check, X, Loader2, Eye, EyeOff } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setEntryVerified, deleteEntry } from '@/app/(dashboard)/entries/actions'
import { formatDate } from '@/lib/utils'

interface EntriesTableProps {
  entries: Entry[]
}

export function EntriesTable({ entries }: EntriesTableProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [selectedEntries, setSelectedEntries] = useState<string[]>([])
  const [showSensitive, setShowSensitive] = useState(false)

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
      <div className="flex items-center justify-between px-6 py-3 border-b border-border">
        {selectedEntries.length > 0 ? (
          <span className="text-sm text-primary font-medium">
            {selectedEntries.length} selected
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">
            {entries.length} entries
          </span>
        )}
        <div className="flex gap-3">
          <button
            onClick={() => setShowSensitive(!showSensitive)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {showSensitive ? <EyeOff size={14} /> : <Eye size={14} />}
            {showSensitive ? 'Hide Sensitive' : 'Show Sensitive'}
          </button>
          {selectedEntries.length > 0 && (
            <>
              <button className="px-3 py-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                Export
              </button>
              <button className="px-3 py-1 text-xs font-medium text-destructive hover:text-destructive/80 transition-colors">
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedEntries.length === entries.length && entries.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-border text-primary accent-primary"
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                WhatsApp
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Broker
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                MT5 ID / Account ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Entry Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Verified
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => (
              <tr
                key={entry.id}
                className={`border-b border-border hover:bg-accent/50 transition-colors ${
                  selectedEntries.includes(entry.id) ? 'bg-primary/5' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedEntries.includes(entry.id)}
                    onChange={() => toggleEntrySelection(entry.id)}
                    className="w-4 h-4 rounded border-border text-primary accent-primary"
                  />
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-foreground">{entry.name}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-muted-foreground">{showSensitive ? entry.email : '***@***.***'}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-muted-foreground">{showSensitive ? entry.whatsappNumber : '—'}</p>
                </td>
                <td className="px-6 py-4">
                  {entry.broker ? (
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      {entry.broker}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-foreground font-mono">{showSensitive ? entry.accountId || '—' : '—'}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-muted-foreground">
                    {formatDate(entry.entryDate)}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleVerified(entry)}
                    disabled={isPending && busyId === entry.id}
                    title={entry.isVerified ? 'Click to mark unverified' : 'Click to verify'}
                    className="flex items-center gap-1 text-xs font-medium disabled:opacity-50"
                  >
                    {isPending && busyId === entry.id ? (
                      <Loader2 size={16} className="animate-spin text-muted-foreground" />
                    ) : entry.isVerified ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <Check size={16} />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                        <X size={16} />
                        Pending
                      </span>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleDelete(entry)}
                      disabled={isPending && busyId === entry.id}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
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
      <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/50">
        <span className="text-xs text-muted-foreground">
          Showing {entries.length} of {entries.length} entries
        </span>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Previous
          </button>
          <button className="px-3 py-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
