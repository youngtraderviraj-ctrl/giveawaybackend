import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseServerAnon } from '@/lib/supabase/server'

// Allow embedding the form on an external site (e.g. youngtraderviraj.com).
// Set ALLOWED_ORIGIN in your env to lock this down to a specific domain;
// defaults to "*" (any site can submit).
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? '*'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: CORS_HEADERS })
}

// Preflight request sent by browsers before a cross-origin POST.
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

// Returns the currently active (Live) giveaway so the external site can show
// the prize and confirm entries are open. GET /api/entries
export async function GET() {
  const supabase = supabaseServerAnon()
  const { data } = await supabase
    .from('giveaways')
    .select('id, name, prize, description')
    .eq('status', 'Live')
    .order('start_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!data) return json({ active: false })
  return json({ active: true, giveaway: data })
}

const EntrySchema = z.object({
  giveawayId: z.string().uuid().optional(),
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  country: z.string().optional(),
})

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid request body' }, 400)
  }

  const parsed = EntrySchema.safeParse(body)
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? 'Invalid input'
    return json({ error: first }, 400)
  }

  const { name, email, phone, country } = parsed.data
  let { giveawayId } = parsed.data
  const supabase = supabaseServerAnon()

  // If no giveawayId is provided, submit to the current Live giveaway.
  if (!giveawayId) {
    const { data: active } = await supabase
      .from('giveaways')
      .select('id')
      .eq('status', 'Live')
      .order('start_date', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (!active) {
      return json({ error: 'No active giveaway is accepting entries right now.' }, 403)
    }
    giveawayId = active.id
  }

  const { error } = await supabase.from('entries').insert({
    giveaway_id: giveawayId,
    name,
    email,
    phone: phone ?? null,
    country: country ?? null,
  })

  if (error) {
    if (error.code === '23505') {
      return json({ error: 'You have already entered this giveaway.' }, 409)
    }
    // RLS rejection (giveaway not Live) or any other failure
    return json({ error: 'Entries are currently closed for this giveaway.' }, 403)
  }

  return json({ ok: true })
}
