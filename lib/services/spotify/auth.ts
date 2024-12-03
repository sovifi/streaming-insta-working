import { createClient } from '@/lib/supabase/client'

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize'
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'

export class SpotifyAuthService {
  constructor(
    private clientId = process.env.SPOTIFY_CLIENT_ID!,
    private clientSecret = process.env.SPOTIFY_CLIENT_SECRET!,
    private redirectUri = process.env.SPOTIFY_REDIRECT_URI!
  ) {}

  getAuthUrl() {
    const scope = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'user-read-recently-played',
      'playlist-read-private',
      'user-library-read'
    ].join(' ')

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      scope,
      redirect_uri: this.redirectUri,
    })

    return `${SPOTIFY_AUTH_URL}?${params.toString()}`
  }

  async handleCallback(code: string) {
    const response = await fetch(SPOTIFY_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${this.clientId}:${this.clientSecret}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri,
      }),
    })

    const data = await response.json()
    return data
  }
} 