import { Giveaway } from '@/lib/types'
import { Calendar, Users, Trophy, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface HeroCardProps {
  giveaway: Giveaway
}

export function HeroCard({ giveaway }: HeroCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500 p-8 shadow-xl shadow-sky-500/20">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />

      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h2 className="text-3xl font-extrabold text-white drop-shadow-sm">{giveaway.name}</h2>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 backdrop-blur">
                {giveaway.status}
              </span>
            </div>
            <p className="text-white/85 max-w-2xl">{giveaway.description}</p>
          </div>
        </div>

        {/* Prize Section */}
        <div className="bg-white/15 border border-white/30 rounded-2xl p-4 backdrop-blur">
          <p className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">
            Prize
          </p>
          <p className="text-2xl font-bold text-white">{giveaway.prize}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/15 rounded-2xl p-4 border border-white/25 backdrop-blur">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-white/80" />
              <span className="text-xs text-white/80 font-medium">Total Entries</span>
            </div>
            <p className="text-2xl font-bold text-white">{giveaway.totalEntries.toLocaleString()}</p>
          </div>

          <div className="bg-white/15 rounded-2xl p-4 border border-white/25 backdrop-blur">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={16} className="text-white/80" />
              <span className="text-xs text-white/80 font-medium">Winners</span>
            </div>
            <p className="text-2xl font-bold text-white">{giveaway.winners}</p>
          </div>

          <div className="bg-white/15 rounded-2xl p-4 border border-white/25 backdrop-blur">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className="text-white/80" />
              <span className="text-xs text-white/80 font-medium">Ends</span>
            </div>
            <p className="text-lg font-bold text-white">
              {giveaway.endDate.toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/giveaways/create"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-sky-600 font-semibold hover:bg-white/90 transition-colors shadow-lg shadow-black/10"
          >
            <span>New Giveaway</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/entries"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/15 text-white font-semibold border border-white/30 hover:bg-white/25 transition-colors backdrop-blur"
          >
            View Entries
          </Link>

          <Link
            href="/draw-winners"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/15 text-white font-semibold border border-white/30 hover:bg-white/25 transition-colors backdrop-blur"
          >
            Draw Winners
          </Link>
        </div>
      </div>
    </div>
  )
}
