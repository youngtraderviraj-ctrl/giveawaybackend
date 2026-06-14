'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { Play, RotateCcw, Trophy, Loader2 } from 'lucide-react'
import type { Giveaway, Winner } from '@/lib/types'
import { drawWinners, getEligibleCount } from '@/app/(dashboard)/draw-winners/actions'

interface DrawWinnersClientProps {
  giveaways: Giveaway[]
}

export function DrawWinnersClient({ giveaways }: DrawWinnersClientProps) {
  const [selected, setSelected] = useState<Giveaway | null>(giveaways[0] ?? null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winners, setWinners] = useState<Winner[]>([])
  const [eligible, setEligible] = useState<number>(0)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [wheelRotation, setWheelRotation] = useState(0)

  const canvasWidth = 400
  const canvasHeight = 400
  const radius = 150

  // Fetch eligible count whenever the selected giveaway changes
  useEffect(() => {
    if (!selected) return
    setWinners([])
    setError('')
    getEligibleCount(selected.id).then(setEligible).catch(() => setEligible(0))
  }, [selected])

  // Draw the wheel
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvasWidth / 2
    const centerY = canvasHeight / 2
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    const segments = Math.max(eligible, 6)
    const segmentAngle = (2 * Math.PI) / segments

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((wheelRotation * Math.PI) / 180)
    const colors = ['#0ea5e9', '#10b981', '#06b6d4', '#6366f1', '#14b8a6', '#3b82f6']
    for (let i = 0; i < segments; i++) {
      ctx.fillStyle = colors[i % colors.length]
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, radius, i * segmentAngle, (i + 1) * segmentAngle)
      ctx.lineTo(0, 0)
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 3
      ctx.stroke()
    }
    ctx.restore()

    ctx.fillStyle = '#0ea5e9'
    ctx.beginPath()
    ctx.moveTo(centerX - 15, 10)
    ctx.lineTo(centerX + 15, 10)
    ctx.lineTo(centerX, 30)
    ctx.fill()
  }, [wheelRotation, eligible])

  const handleSpin = () => {
    if (isSpinning || !selected || eligible === 0) return
    setError('')
    setIsSpinning(true)

    const spins = 10
    const finalAngle = Math.random() * 360
    const totalRotation = spins * 360 + finalAngle
    const start = wheelRotation
    const step = totalRotation / 60
    let current = start

    const interval = setInterval(() => {
      current += step
      setWheelRotation(current)
      if (current >= start + totalRotation) {
        clearInterval(interval)
        setWheelRotation((start + totalRotation) % 360)
        setIsSpinning(false)
        // Real draw happens server-side
        startTransition(async () => {
          try {
            const result = await drawWinners(selected.id, selected.winners)
            setWinners(result)
            if (result.length === 0) {
              setError('No eligible entrants left to draw (all verified entrants may have already won).')
            }
            const count = await getEligibleCount(selected.id)
            setEligible(count)
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to draw winners.')
          }
        })
      }
    }, 50)
  }

  const handleReset = () => {
    setWheelRotation(0)
    setWinners([])
    setError('')
  }

  if (!selected) {
    return (
      <div className="card-surface p-10 text-center">
        <p className="text-muted">No giveaways found. Create a giveaway first.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
          Select Giveaway
        </label>
        <select
          value={selected.id}
          onChange={(e) => {
            const g = giveaways.find((x) => x.id === e.target.value)
            if (g) setSelected(g)
          }}
          className="input-field"
        >
          {giveaways.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name} ({g.status})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card-surface p-8">
            <div className="flex flex-col items-center gap-6">
              <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                className="rounded-2xl shadow-2xl shadow-sky-500/20"
              />
              <div className="text-center space-y-2">
                <p className="text-sm text-muted">{selected.name}</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {eligible} Eligible Entries
                </p>
                <p className="text-sm text-sky-600 dark:text-sky-400 font-semibold">
                  Drawing {selected.winners} winner{selected.winners !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                ✓ Lifetime Winner Protection Enabled
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleSpin}
                  disabled={isSpinning || isPending || eligible === 0}
                  className="btn-primary px-8 py-3"
                >
                  {isSpinning || isPending ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
                  <span>{isSpinning ? 'Spinning…' : isPending ? 'Saving…' : 'Start Draw'}</span>
                </button>
                <button onClick={handleReset} className="btn-ghost px-8 py-3">
                  <RotateCcw size={18} />
                  <span>Reset</span>
                </button>
              </div>
              {error && <p className="text-sm font-medium text-rose-500 text-center">{error}</p>}
            </div>
          </div>
        </div>

        <div className="card-surface p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Trophy size={20} className="text-emerald-500" />
            Winners
          </h3>
          {winners.length > 0 ? (
            <div className="space-y-4">
              {winners.map((winner, idx) => (
                <div
                  key={winner.id}
                  className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-sky-500/10 border border-emerald-500/30"
                >
                  <p className="font-semibold text-emerald-600 dark:text-emerald-300 text-sm mb-1">
                    Winner #{idx + 1}
                  </p>
                  <p className="font-bold text-slate-900 dark:text-white mb-1">{winner.name || winner.email}</p>
                  <p className="text-xs text-muted mb-2">{winner.email}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-300 font-medium">
                    Prize: {winner.prize}
                  </p>
                </div>
              ))}
              <p className="text-xs text-muted text-center pt-2">
                ✓ Winners saved automatically
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-muted text-sm">
                Click &quot;Start Draw&quot; to spin the wheel and select winners
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
