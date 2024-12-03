'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { SpotifyAuthService } from '@/lib/services/spotify/auth'
import { LastFmAuthService } from '@/lib/services/lastfm/auth'

export function StreamingConnect() {
  const [isConnecting, setIsConnecting] = useState(false)
  const spotifyAuth = new SpotifyAuthService()
  const lastfmAuth = new LastFmAuthService()

  const handleSpotifyConnect = () => {
    window.location.href = spotifyAuth.getAuthUrl()
  }

  const handleLastFmConnect = () => {
    window.location.href = lastfmAuth.getAuthUrl()
  }

  return (
    <div className="space-y-4">
      <Button onClick={handleSpotifyConnect} disabled={isConnecting}>
        Connect Spotify
      </Button>

      <Button onClick={handleLastFmConnect} disabled={isConnecting}>
        Connect Last.fm
      </Button>
    </div>
  )
} 