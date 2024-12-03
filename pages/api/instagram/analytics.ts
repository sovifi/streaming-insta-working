import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('API Route: Received request', { 
      method: req.method,
      query: req.query 
    })

    const supabase = createServerSupabaseClient({ req, res })
    
    const {
      data: { session },
    } = await supabase.auth.getSession()

    console.log('API Route: Auth check', { 
      hasSession: !!session 
    })

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { range } = req.query
    
    if (!range) {
      return res.status(400).json({ message: 'Range parameter is required' })
    }

    const analyticsData = {
      range,
      metrics: {
        followers: 100,
        engagement: 50,
      }
    }

    console.log('API Route: Sending response', analyticsData)
    return res.status(200).json(analyticsData)
  } catch (error) {
    console.error('API Route Error:', error)
    return res.status(500).json({ 
      message: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 