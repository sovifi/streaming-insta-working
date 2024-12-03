'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ConnectionsContent() {
  const handleSpotifyConnect = () => {
    // Implement Spotify connection
  }

  const handleLastFmConnect = () => {
    // Implement Last.fm connection
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Your Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={handleSpotifyConnect}>
            Connect Spotify
          </Button>
          <Button onClick={handleLastFmConnect}>
            Connect Last.fm
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 