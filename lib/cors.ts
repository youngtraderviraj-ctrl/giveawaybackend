// Shared CORS helper for the public API routes.
//
// Production origin is controlled by ALLOWED_ORIGIN (defaults to "*").
//
// TEMPORARY LOCALHOST ACCESS:
//   Localhost origins (http://localhost:* / http://127.0.0.1:*) are reflected
//   automatically so you can test the embed widget locally.
//   To TURN IT OFF, set this in your env:  ENABLE_LOCALHOST_CORS=false
const PROD_ORIGIN = process.env.ALLOWED_ORIGIN ?? '*'
const LOCALHOST_ENABLED = process.env.ENABLE_LOCALHOST_CORS !== 'false'
const LOCALHOST_REGEX = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/

export function corsHeaders(req: Request, methods = 'GET, POST, OPTIONS') {
  const origin = req.headers.get('origin') ?? ''
  const allowOrigin =
    LOCALHOST_ENABLED && LOCALHOST_REGEX.test(origin) ? origin : PROD_ORIGIN

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
}
