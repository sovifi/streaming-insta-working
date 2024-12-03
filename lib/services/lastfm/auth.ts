import md5 from 'md5'

export class LastFmAuthService {
  private apiKey: string
  private secret: string
  private callbackUrl: string

  constructor() {
    this.apiKey = process.env.LASTFM_API_KEY!
    this.secret = process.env.LASTFM_SHARED_SECRET!
    this.callbackUrl = process.env.LASTFM_CALLBACK_URL!
  }

  getAuthUrl() {
    const params = new URLSearchParams({
      api_key: this.apiKey,
      cb: this.callbackUrl,
    })

    return `http://www.last.fm/api/auth/?${params.toString()}`
  }

  async getSession(token: string) {
    const method = 'auth.getSession'
    const signature = this.generateSignature({
      method,
      api_key: this.apiKey,
      token,
    })

    const params = new URLSearchParams({
      method,
      api_key: this.apiKey,
      token,
      api_sig: signature,
      format: 'json',
    })

    const response = await fetch(`http://ws.audioscrobbler.com/2.0/?${params.toString()}`)
    return response.json()
  }

  private generateSignature(params: Record<string, string>) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}${params[key]}`)
      .join('')

    const signatureString = sortedParams + this.secret
    return md5(signatureString)
  }
} 