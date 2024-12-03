'use client'

import { Button } from '@/components/ui/button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'

export function StreamingConnect() {
  const [isConnecting, setIsConnecting] = useState(false)
  
  const handleFacebookConnect = async () => {
    setIsConnecting(true)
    
    try {
      const FACEBOOK_APP_ID = '1274229907110138'
      const REDIRECT_URI = encodeURIComponent(`${window.location.origin}/api/auth/instagram/callback`)
      
      // Simplified scopes and parameters
      const SCOPES = encodeURIComponent('instagram_basic,instagram_content_publish,pages_show_list')
      
      // Direct OAuth URL without business/cancel path
      const facebookUrl = 'https://www.facebook.com/v21.0/dialog/oauth'
        + `?client_id=${FACEBOOK_APP_ID}`
        + `&redirect_uri=${REDIRECT_URI}`
        + `&scope=${SCOPES}`
        + `&response_type=code`
        + `&state=${encodeURIComponent(window.location.pathname)}`  // Save current path
        + `&auth_type=reauthorize`  // Force reauthorization
        + `&display=page`  // Use page display for better business account flow
        + `&set_token_expires_in_60_days=true`  // Request long-lived token
      
      // Store current path in localStorage before redirect
      localStorage.setItem('fb_return_path', window.location.pathname)
      
      // Redirect to Facebook
      window.location.href = facebookUrl

    } catch (error) {
      console.error('Connection error:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button 
        onClick={handleFacebookConnect}
        disabled={isConnecting}
        className="w-full"
      >
        {isConnecting ? 'Connecting...' : 'Connect Instagram Business Account'}
      </Button>
    </div>
  )
} 