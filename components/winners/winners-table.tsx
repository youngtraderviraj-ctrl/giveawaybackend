'use client'

import { Winner } from '@/lib/types'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { formatDate } from '@/lib/utils'
import { WinnerStatusSelect } from './winner-status-select'

interface WinnersTableProps {
  winners: Winner[]
  giveawayNames: Map<string, string>
}

export function WinnersTable({ winners, giveawayNames }: WinnersTableProps) {
  const [showSensitive, setShowSensitive] = useState(false)

  return (
    <div className="card-surface overflow-hidden border-primary/10 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border">
        <span className="text-sm text-muted-foreground">
          {winners.length} winners
        </span>
        <button
          onClick={() => setShowSensitive(!showSensitive)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          {showSensitive ? <EyeOff size={14} /> : <Eye size={14} />}
          {showSensitive ? 'Hide Sensitive' : 'Show Sensitive'}
        </button>
      </div>

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
                WhatsApp
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Broker
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                MT5 ID / Account ID
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
                      {winner.broker && (
                        <p className="text-xs text-muted-foreground">{winner.broker}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-muted-foreground">{showSensitive ? winner.email : '***@***.***'}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-muted-foreground">{showSensitive ? winner.whatsappNumber || '—' : '—'}</p>
                </td>
                <td className="px-6 py-4">
                  {winner.broker ? (
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      {winner.broker}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-foreground font-mono">{showSensitive ? winner.accountId || '—' : '—'}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-foreground font-medium">{giveawayNames.get(winner.giveawayId) ?? '—'}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-foreground/80">{winner.prize}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-muted-foreground">
                    {formatDate(winner.wonDate)}
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
  )
}
