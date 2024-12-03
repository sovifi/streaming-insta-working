import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)

    // Get the intended destination
    const redirectTo = requestUrl.searchParams.get('redirect') || '/dashboard'
    
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  // If no code, redirect to login
  return NextResponse.redirect(new URL('/auth/login', request.url))
} 