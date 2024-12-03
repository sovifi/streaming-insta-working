export class LastFmService {
  private apiKey: string
  private baseUrl = 'http://ws.audioscrobbler.com/2.0/'

  constructor(apiKey = process.env.LASTFM_API_KEY!) {
    this.apiKey = apiKey
  }

  async getUserRecentTracks(username: string, from?: number, to?: number) {
    const params = new URLSearchParams({
      method: 'user.getrecenttracks',
      user: username,
      api_key: this.apiKey,
      format: 'json',
      limit: '200',
    })

    if (from) params.append('from', from.toString())
    if (to) params.append('to', to.toString())

    const response = await fetch(`${this.baseUrl}?${params.toString()}`)
    return response.json()
  }

  async getUserTopArtists(username: string, period: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month' = 'overall') {
    const params = new URLSearchParams({
      method: 'user.gettopartists',
      user: username,
      api_key: this.apiKey,
      format: 'json',
      period,
    })

    const response = await fetch(`${this.baseUrl}?${params.toString()}`)
    return response.json()
  }
} 