import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { corsHeaders } from '@/lib/cors'

function json(req: Request, body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: corsHeaders(req, 'POST, OPTIONS') })
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req, 'POST, OPTIONS') })
}

const VerifyXmSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required'),
  email: z.string().email().optional(),
})

// XM account IDs are numeric (typically 5-10 digits).
const XM_ACCOUNT_ID_RE = /^\d{5,10}$/

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return json(req, { error: 'Invalid request body' }, 400)
  }

  const parsed = VerifyXmSchema.safeParse(body)
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? 'Invalid input'
    return json(req, { verified: false, error: first }, 400)
  }

  const { accountId, email } = parsed.data
  const normalizedId = accountId.trim()

  if (!XM_ACCOUNT_ID_RE.test(normalizedId)) {
    return json(req, { verified: false, error: 'Invalid XM account ID format.' }, 400)
  }

  const supabase = supabaseAdmin()

  // Reject account IDs that are already registered to another entry.
  const { data: existing, error } = await supabase
    .from('entries')
    .select('id, email')
    .eq('broker', 'XM')
    .eq('account_id', normalizedId)
    .limit(1)
    .maybeSingle()

  if (error) {
    return json(req, { verified: false, error: 'Unable to verify account right now. Please try again.' }, 500)
  }

  if (existing) {
    const sameEmail = email && existing.email.toLowerCase() === email.toLowerCase()
    return json(req, {
      verified: false,
      error: sameEmail
        ? 'This XM account ID is already registered to your email.'
        : 'This XM account ID has already been used to enter the giveaway.',
    }, 409)
  }

  // TODO: Replace the format check with a real XM API verification when
  // you have credentials (e.g. XM partner API, MyFXBook, etc.).
  return json(req, { verified: true, accountId: normalizedId })
}
