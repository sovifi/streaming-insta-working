'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface AnalyticsData {
  range: string
  metrics: {
    followers: number
    engagement: number
    // ... other metrics
  }
}

const InstagramAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('7d')
  
  const supabase = createClientComponentClient()

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      if (authError || !session) {
        throw new Error('Authentication required')
      }

      console.log('Fetching analytics for range:', timeRange) // Debug log

      const response = await fetch(`/api/instagram/analytics?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Response:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        })
        throw new Error(`API error: ${errorData.message || response.statusText}`)
      }

      const data = await response.json()
      console.log('Received analytics data:', data) // Debug log
      setAnalytics(data)
    } catch (err) {
      console.error('Analytics error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  if (loading) return <div>Loading analytics...</div>
  if (error) return <div>Error: {error}</div>
  if (!analytics) return <div>No data available</div>

  return (
    <div>
      <h2>Instagram Analytics</h2>
      <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="90d">Last 90 days</option>
      </select>
      
      <div>
        <h3>Metrics</h3>
        <p>Followers: {analytics.metrics.followers}</p>
        <p>Engagement: {analytics.metrics.engagement}</p>
      </div>
    </div>
  )
}

export default InstagramAnalytics