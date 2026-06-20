'use client'

import { useState } from 'react'
import { Loader2, CheckCircle2, Gift } from 'lucide-react'
import { BROKERS } from '@/lib/types'

interface EntryFormProps {
  giveawayId: string
  prize: string
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function EntryForm({ giveawayId, prize }: EntryFormProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({ name: '', email: '', whatsappNumber: '', broker: '', accountId: '' })

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setMessage('')

    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ giveawayId, ...form }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus('error')
        setMessage(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      setStatus('success')
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="card-surface p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="text-primary" size={36} />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">You&apos;re in!</h3>
        <p className="text-muted-foreground">
          Your entry has been recorded. Winners are drawn at random — good luck!
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card-surface p-8 space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Gift className="text-primary" size={22} />
        </div>
        <p className="text-sm text-muted-foreground">
          Prize: <span className="font-medium text-foreground">{prize}</span>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Full name</label>
        <input className="input-field" required value={form.name} onChange={update('name')} placeholder="Your name" />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
        <input className="input-field" type="email" required value={form.email} onChange={update('email')} placeholder="you@email.com" />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">WhatsApp number</label>
        <input className="input-field" required value={form.whatsappNumber} onChange={update('whatsappNumber')} placeholder="+91…" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Broker</label>
          <select className="input-field" required value={form.broker} onChange={update('broker')}>
            <option value="" disabled>
              Select your broker
            </option>
            {BROKERS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">MT5 ID / Account ID</label>
          <input className="input-field" required value={form.accountId} onChange={update('accountId')} placeholder="e.g. 1234567" />
        </div>
      </div>

      {status === 'error' && (
        <p className="text-sm font-medium text-destructive">{message}</p>
      )}

      <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full justify-center py-3">
        {status === 'submitting' ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Submitting…</span>
          </>
        ) : (
          <span>Enter Giveaway</span>
        )}
      </button>
    </form>
  )
}
