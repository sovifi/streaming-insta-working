'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Analytics } from '@/types/database'

export function AnalyticsSummary() {
  const [analytics, setAnalytics] = useState<Analytics[]>([])

  useEffect(() => {
    async function fetchAnalytics() {
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Error fetching analytics:', error)
        return
      }

      setAnalytics(data)
    }

    fetchAnalytics()
  }, [])

  return (
    <div>
      {/* Render your analytics data */}
    </div>
  )
} 