import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { corsHeaders } from '@/lib/cors'

function json(req: Request, body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: corsHeaders(req, 'GET, OPTIONS') })
}

// Preflight request sent by browsers before a cross-origin GET.
export async function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req, 'GET, OPTIONS') })
}

// Returns past giveaway winners (only claimed or contacted winners).
// GET /api/winners
export async function GET(req: Request) {
  const supabase = supabaseAdmin()
  
  const { data, error } = await supabase
    .from('winners')
    .select(`
      email,
      prize,
      status,
      won_at,
      entries!inner (
        name,
        whatsapp_number,
        broker,
        account_id
      ),
      giveaways!inner (
        name,
        prize
      )
    `)
    .in('status', ['Claimed', 'Contacted'])
    .order('won_at', { ascending: false })

  if (error) {
    return json(req, { error: 'Failed to fetch winners' }, 500)
  }

  const winners = (data as any[])?.map(w => ({
    name: w.entries?.name,
    email: w.email,
    whatsappNumber: w.entries?.whatsapp_number,
    broker: w.entries?.broker,
    accountId: w.entries?.account_id,
    giveaway: w.giveaways?.name,
    prize: w.prize || w.giveaways?.prize,
    won_at: w.won_at,
  })) ?? []

  return json(req, { winners })
}
