// Shared CORS helper for the public API routes.
// CORS is disabled — the public API can be called from any origin.
export function corsHeaders(_req: Request, methods = 'GET, POST, OPTIONS') {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': '*',
  }
}
