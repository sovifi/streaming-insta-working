import { SpotifyAuthService } from '../spotify/auth'
import { LastFmService } from '../lastfm'
import { createClient } from '@/lib/supabase/client'

export class StreamingDataAggregator {
  private lastfm: LastFmService
  private supabase = createClient()

  constructor() {
    this.lastfm = new LastFmService()
  }

  async aggregateUserData(userId: string, lastfmUsername: string) {
    // Get Spotify connection
    const { data: spotifyConnection } = await this.supabase
      .from('platform_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', 'spotify')
      .single()

    // Get Last.fm data
    const lastfmData = await this.lastfm.getUserRecentTracks(lastfmUsername)

    // Process and store the combined data
    const processedData = this.processStreamingData(lastfmData, spotifyConnection)
    
    // Store in analytics table
    await this.supabase
      .from('analytics')
      .insert(processedData.map(item => ({
        user_id: userId,
        platform: 'streaming',
        metric: item.metric,
        value: item.value,
        timestamp: item.timestamp
      })))

    return processedData
  }

  private processStreamingData(lastfmData: any, spotifyConnection: any) {
    // Implement your data processing logic here
    // Combine and normalize data from both sources
    return []
  }
} 