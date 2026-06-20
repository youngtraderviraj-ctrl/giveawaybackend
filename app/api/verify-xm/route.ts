import { NextResponse } from 'next/server'
import { corsHeaders } from '@/lib/cors'

function json(req: Request, body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: corsHeaders(req, 'POST, OPTIONS') })
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req, 'POST, OPTIONS') })
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return json(req, { error: 'Invalid request body' }, 400)
  }

  // TODO: implement XM broker verification logic here.
  return json(req, { ok: true, received: body })
}
