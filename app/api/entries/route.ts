import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseServerAnon } from '@/lib/supabase/server'
import { corsHeaders } from '@/lib/cors'
import { BROKERS } from '@/lib/types'

function json(req: Request, body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: corsHeaders(req) })
}

// Preflight request sent by browsers before a cross-origin POST.
export async function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) })
}

// Returns the currently active (Live) giveaway so the external site can show
// the prize and confirm entries are open. GET /api/entries
export async function GET(req: Request) {
  const supabase = supabaseServerAnon()
  const { data } = await supabase
    .from('giveaways')
    .select('id, name, prize, description')
    .eq('status', 'Live')
    .order('start_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!data) return json(req, { active: false })
  return json(req, { active: true, giveaway: data })
}

const EntrySchema = z.object({
  giveawayId: z.string().uuid().optional(),
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Enter a valid email'),
  whatsappNumber: z.string().min(5, 'Enter a valid WhatsApp number'),
  broker: z.enum(BROKERS, { message: 'Select your broker' }),
  accountId: z.string().min(1, 'Enter your MT5 ID / Account ID'),
})

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return json(req, { error: 'Invalid request body' }, 400)
  }

  const parsed = EntrySchema.safeParse(body)
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? 'Invalid input'
    return json(req, { error: first }, 400)
  }

  const { name, email, whatsappNumber, broker, accountId } = parsed.data
  let { giveawayId } = parsed.data
  const supabase = supabaseServerAnon()

  // Resolve the target giveaway. If an ID is provided, it must be Live.
  if (giveawayId) {
    const { data: target } = await supabase
      .from('giveaways')
      .select('id, status')
      .eq('id', giveawayId)
      .maybeSingle()
    if (!target) {
      return json(req, { error: 'Giveaway not found.' }, 404)
    }
    if (target.status !== 'Live') {
      return json(req, { error: 'Entries are currently closed for this giveaway.' }, 403)
    }
  } else {
    // If no giveawayId is provided, submit to the current Live giveaway.
    const { data: active } = await supabase
      .from('giveaways')
      .select('id')
      .eq('status', 'Live')
      .order('start_date', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (!active) {
      return json(req, { error: 'No active giveaway is accepting entries right now.' }, 403)
    }
    giveawayId = active.id
  }

  const { error } = await supabase.from('entries').insert({
    giveaway_id: giveawayId,
    name,
    email,
    whatsapp_number: whatsappNumber,
    broker,
    account_id: accountId,
    is_verified: broker === 'XM',
  })

  if (error) {
    if (error.code === '23505') {
      return json(req, { error: 'You have already entered this giveaway.' }, 409)
    }
    // RLS rejection (giveaway not Live) or any other failure
    return json(req, { error: 'Entries are currently closed for this giveaway.' }, 403)
  }

  return json(req, { ok: true })
}
