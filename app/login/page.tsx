'use client'

import { useState, useTransition, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Lock, Gift } from 'lucide-react'
import { signIn } from './actions'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const result = await signIn(email, password)
      if (!result.ok) {
        setError(result.error)
        return
      }
      const redirect = searchParams.get('redirect') || '/dashboard'
      router.replace(redirect)
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="card-surface w-full max-w-sm p-8 space-y-5">
      <div className="flex flex-col items-center gap-3 mb-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary">
          <Gift className="text-primary-foreground" size={26} />
        </div>
        <h1 className="text-xl font-semibold text-foreground">Admin Login</h1>
        <p className="text-sm text-muted-foreground">Sign in to manage your giveaways</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          placeholder="admin@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          placeholder="••••••••"
        />
      </div>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <button type="submit" disabled={isPending} className="btn-primary w-full justify-center py-3">
        {isPending ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
        <span>{isPending ? 'Signing in…' : 'Sign In'}</span>
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
