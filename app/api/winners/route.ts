import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// Allow embedding on external sites (e.g. youngtraderviraj.com).
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? '*'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: CORS_HEADERS })
}

// Preflight request sent by browsers before a cross-origin GET.
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

// Returns past giveaway winners (only claimed or contacted winners).
// GET /api/winners
export async function GET() {
  const supabase = supabaseAdmin()
  
  const { data, error } = await supabase
    .from('winners')
    .select(`
      email,
      prize,
      status,
      won_at,
      entries!inner (
        name
      ),
      giveaways!inner (
        name,
        prize
      )
    `)
    .in('status', ['Claimed', 'Contacted'])
    .order('won_at', { ascending: false })

  if (error) {
    return json({ error: 'Failed to fetch winners' }, 500)
  }

  const winners = (data as any[])?.map(w => ({
    name: w.entries?.name,
    giveaway: w.giveaways?.name,
    prize: w.prize || w.giveaways?.prize,
    won_at: w.won_at,
  })) ?? []

  return json({ winners })
}
