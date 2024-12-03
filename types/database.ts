export type Profile = {
  id: string
  email: string
  full_name: string | null
  created_at: string
  updated_at: string
}

export type PlatformConnection = {
  id: string
  user_id: string
  platform: string
  access_token: string
  refresh_token: string | null
  connected: boolean
  last_synced: string
  created_at: string
}

export type Analytics = {
  id: string
  user_id: string
  platform: string
  metric: string
  value: number
  timestamp: string
  created_at: string
} 