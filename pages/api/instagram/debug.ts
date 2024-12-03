import { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('=== Debug Request Started ===')
  const supabase = createServerSupabaseClient({ req, res })
  
  try {
    // Get session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return res.status(200).json({ 
        error: 'No active session',
        userId: null,
        credentials: null
      })
    }

    // Get credentials
    const { data: credentials, error: credError } = await supabase
      .from('instagram_accounts')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (credError) {
      return res.status(200).json({
        error: 'Database error',
        details: credError.message,
        userId: session.user.id,
        credentials: null
      })
    }

    if (!credentials) {
      return res.status(200).json({
        error: 'No credentials found',
        userId: session.user.id,
        credentials: null
      })
    }

    // Test Instagram API connection
    const testUrl = `https://graph.facebook.com/v18.0/${credentials.instagram_business_id}?fields=username&access_token=${credentials.access_token}`
    const response = await fetch(testUrl)
    const data = await response.json()

    return res.status(200).json({
      success: true,
      userId: session.user.id,
      hasCredentials: true,
      apiTest: {
        status: response.status,
        data: data
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return res.status(200).json({
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 