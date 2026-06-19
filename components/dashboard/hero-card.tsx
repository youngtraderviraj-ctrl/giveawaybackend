import { Giveaway } from '@/lib/types'
import { Calendar, Users, Trophy, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface HeroCardProps {
  giveaway: Giveaway
}

export function HeroCard({ giveaway }: HeroCardProps) {
  return (
    <div className="card-surface p-8 relative overflow-hidden group">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-700 mix-blend-screen pointer-events-none"></div>
      <div className="space-y-6 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 tracking-tight">{giveaway.name}</h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/15 text-primary border border-primary/30 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] backdrop-blur-md uppercase tracking-wider">
                {giveaway.status}
              </span>
            </div>
            <p className="text-muted-foreground max-w-2xl">{giveaway.description}</p>
          </div>
        </div>

        {/* Prize Section */}
        <div className="card-inset p-5 border-primary/20 shadow-[inset_0_0_20px_rgba(var(--primary-rgb),0.05)]">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1.5">
            Grand Prize
          </p>
          <p className="text-2xl font-bold text-foreground">{giveaway.prize}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-inset p-5 hover:bg-muted/60 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Users size={18} className="text-chart-1" />
              <span className="text-sm text-muted-foreground font-medium">Total Entries</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{giveaway.totalEntries.toLocaleString()}</p>
          </div>

          <div className="card-inset p-5 hover:bg-muted/60 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={18} className="text-chart-5" />
              <span className="text-sm text-muted-foreground font-medium">Winners</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{giveaway.winners}</p>
          </div>

          <div className="card-inset p-5 hover:bg-muted/60 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={18} className="text-primary" />
              <span className="text-sm text-muted-foreground font-medium">Ends</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {giveaway.endDate.toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/giveaways/create"
            className="btn-primary"
          >
            <span>New Giveaway</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/entries"
            className="btn-ghost"
          >
            View Entries
          </Link>

          <Link
            href="/draw-winners"
            className="btn-ghost"
          >
            Draw Winners
          </Link>
        </div>
      </div>
    </div>
  )
}
