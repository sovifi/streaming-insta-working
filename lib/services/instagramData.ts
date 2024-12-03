import { supabase } from '../supabase'
import { getInstagramInsights } from './instagram'

export async function fetchInstagramAnalytics(userId: string) {
  // Get stored credentials
  const { data: credentials, error: credError } = await supabase
    .from('instagram_accounts')
    .select('*')
    .eq('id', userId)
    .single()

  if (credError || !credentials) {
    console.error('No Instagram credentials found:', credError)
    throw new Error('No Instagram credentials found')
  }

  try {
    // Fetch insights using stored credentials
    const insights = await getInstagramInsights(
      credentials.instagram_business_id,
      credentials.access_token
    )

    // Format the data for the chart
    const formattedData = {
      dates: [],
      engagement: [],
      followers: 0,
      reach: 0,
      impressions: 0
    }

    insights.data.forEach((metric: any) => {
      switch (metric.name) {
        case 'follower_count':
          formattedData.followers = metric.values[0].value
          break
        case 'reach':
          formattedData.reach = metric.values[0].value
          // Add to time series data
          metric.values.forEach((value: any) => {
            formattedData.dates.push(new Date(value.end_time).toLocaleDateString())
            formattedData.engagement.push(value.value)
          })
          break
        case 'impressions':
          formattedData.impressions = metric.values[0].value
          break
      }
    })

    return formattedData
  } catch (error) {
    console.error('Error fetching Instagram analytics:', error)
    throw error
  }
} 