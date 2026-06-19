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
  const [showCelebration, setShowCelebration] = useState(false)
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

    const duration = 10000 // 10 seconds
    const intervalTime = 50
    const steps = duration / intervalTime
    const spins = 30 // More spins since it takes longer
    const finalAngle = Math.random() * 360
    const totalRotation = spins * 360 + finalAngle
    const start = wheelRotation
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      // Ease out cubic
      const t = currentStep / steps
      const easeOut = 1 - Math.pow(1 - t, 3)
      const current = start + (totalRotation * easeOut)
      
      setWheelRotation(current)
      if (currentStep >= steps) {
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
            } else {
              setShowCelebration(true)
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
    setShowCelebration(false)
    setError('')
  }

  if (!selected) {
    return (
      <div className="card-surface p-10 text-center">
        <p className="text-muted">No giveaways found. Create a giveaway first.</p>
      </div>
    )
  }

  if (showCelebration && winners.length > 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-3xl animate-in fade-in duration-1000">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          {/* Decorative glowing orbs */}
          <div className="absolute w-96 h-96 bg-primary/40 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-chart-2/40 rounded-full blur-[100px] animate-pulse delay-700 ml-64 mt-64"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-12 max-w-4xl px-4">
          <div className="space-y-4">
            <Trophy size={64} className="mx-auto text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)] animate-bounce" />
            <h2 className="text-3xl font-bold text-muted-foreground tracking-widest uppercase">We have our winners!</h2>
          </div>
          
          <div className="space-y-6">
            {winners.map((w, i) => (
              <div key={w.id} className="animate-in slide-in-from-bottom-8 fade-in duration-1000" style={{ animationDelay: `${i * 300}ms`, animationFillMode: 'both' }}>
                <h1 className="text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-chart-1 to-chart-2 drop-shadow-lg">
                  {w.name || w.email}
                </h1>
              </div>
            ))}
          </div>

          <button onClick={handleReset} className="mt-12 btn-ghost rounded-full px-8 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-md border-white/10 text-foreground transition-all">
            Start New Draw
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <label className="block text-sm font-semibold text-foreground mb-3">
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
          <div className="card-surface p-8 relative overflow-hidden">
            {/* Background ambient light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-primary/5 via-transparent to-chart-1/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col items-center gap-6 relative z-10">
              <div className="relative">
                {/* Pointer shadow */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary/20 blur-xl rounded-full"></div>
                <canvas
                  ref={canvasRef}
                  width={canvasWidth}
                  height={canvasHeight}
                  className="rounded-full shadow-[0_0_50px_rgba(var(--primary-rgb),0.15)] ring-4 ring-border/50 bg-card/80 backdrop-blur-md"
                />
              </div>
              <div className="text-center space-y-2 mt-4">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{selected.name}</p>
                <p className="text-3xl font-extrabold text-foreground">
                  {eligible} Eligible Entries
                </p>
                <p className="text-sm text-primary font-semibold">
                  Drawing {selected.winners} winner{selected.winners !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="px-4 py-2 rounded-full bg-chart-2/15 border border-chart-2/30 text-xs font-semibold text-chart-2">
                ✓ Lifetime Winner Protection Enabled
              </div>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={handleSpin}
                  disabled={isSpinning || isPending || eligible === 0}
                  className="btn-primary px-8 py-3 rounded-full shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] transition-all duration-300 transform hover:-translate-y-1"
                >
                  {isSpinning || isPending ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} className="ml-1" />}
                  <span className="font-bold text-base">{isSpinning ? 'Spinning...' : isPending ? 'Saving...' : 'SPIN THE WHEEL'}</span>
                </button>
                <button onClick={handleReset} className="btn-ghost px-8 py-3 rounded-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all">
                  <RotateCcw size={18} />
                  <span>Reset</span>
                </button>
              </div>
              {error && <p className="text-sm font-medium text-destructive text-center p-3 bg-destructive/10 rounded-lg border border-destructive/20 w-full mt-2">{error}</p>}
            </div>
          </div>
        </div>

        <div className="card-surface p-6 h-fit max-h-[800px] overflow-auto">
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 sticky top-0 bg-card/95 backdrop-blur-md pb-2 z-10 border-b border-border/50">
            <Trophy size={20} className="text-chart-2" />
            Previous Winners
          </h3>
          {winners.length > 0 ? (
            <div className="space-y-4">
              {winners.map((winner, idx) => (
                <div
                  key={winner.id}
                  className="p-5 rounded-2xl bg-gradient-to-br from-chart-2/10 to-primary/5 border border-chart-2/20 shadow-sm hover:shadow-md transition-all hover:border-chart-2/40"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-chart-2 text-sm uppercase tracking-wider">
                      Winner #{idx + 1}
                    </p>
                    <Trophy size={14} className="text-chart-2/50" />
                  </div>
                  <p className="font-bold text-foreground text-lg mb-1 line-clamp-1">{winner.name || winner.email}</p>
                  <p className="text-xs text-muted-foreground mb-3">{winner.email}</p>
                  <div className="inline-block px-3 py-1 bg-background/50 rounded-lg border border-border/50">
                    <p className="text-xs text-foreground font-medium">
                      Prize: <span className="text-primary">{winner.prize}</span>
                    </p>
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground text-center pt-4 flex items-center justify-center gap-1">
                <span className="text-chart-2">✓</span> Winners saved securely
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6 border-2 border-dashed border-border/50 rounded-2xl">
              <Trophy size={32} className="text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground font-medium">
                No winners drawn yet
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Spin the wheel to select winners for this giveaway
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
