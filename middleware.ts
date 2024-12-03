import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Allow auth callback to proceed
  if (req.nextUrl.pathname === '/auth/callback') {
    return res
  }

  // Handle specific callback routes differently
  if (req.nextUrl.pathname.startsWith('/api/auth/instagram/callback')) {
    return res
  }

  // If no session and trying to access protected route, redirect to login
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If session and trying to access auth routes, redirect to dashboard
  if (session && req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/auth/:path*',
    '/api/auth/:path*',
    '/auth/callback'
  ]
} 