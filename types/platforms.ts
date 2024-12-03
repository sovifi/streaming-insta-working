export type SocialPlatform = 'instagram' | 'tiktok' | 'x'
export type StreamingPlatform = 'spotify' | 'youtube' | 'apple-music'

export interface PlatformConnection {
  id: string
  userId: string
  platform: SocialPlatform | StreamingPlatform
  accessToken: string
  refreshToken: string
  connected: boolean
  lastSynced: Date
} 