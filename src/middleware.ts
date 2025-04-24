import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Get the hostname of the request
  const origin = request.headers.get('origin') || ''

  // Define allowed origins - add your production domain when ready
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    // Add your production domain here
  ]

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    // Only allow specific origins
    const responseHeaders = new Headers({
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Max-Age': '86400',
    })

    // Only add Allow-Origin if the origin is in our allowed list
    if (allowedOrigins.includes(origin)) {
      responseHeaders.set('Access-Control-Allow-Origin', origin)
    }

    return new NextResponse(null, { headers: responseHeaders })
  }

  // Handle actual request
  const response = await updateSession(request)

  // Add CORS headers to response
  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
