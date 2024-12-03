'use client'
import { useEffect, useState } from 'react'
import { getFacebookAuthUrl } from '@/lib/services/instagram'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function InstagramConnect() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data } = await supabase
        .from('instagram_accounts')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setIsConnected(!!data)
      setDebugInfo(data)
    } catch (error) {
      console.error('Error checking connection:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = () => {
    console.log('Connecting to Instagram...')
    const authUrl = getFacebookAuthUrl()
    window.location.href = authUrl
  }

  const handleDisconnect = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { error } = await supabase
        .from('instagram_accounts')
        .delete()
        .eq('id', session.user.id)

      if (error) throw error
      setIsConnected(false)
      setDebugInfo(null)
      window.location.reload()
    } catch (error) {
      console.error('Error disconnecting:', error)
    }
  }

  const handleDebug = async () => {
    try {
      const response = await fetch('/api/instagram/debug')
      const data = await response.json()
      console.log('Debug info:', data)
      alert(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('Debug error:', error)
      alert('Error getting debug info')
    }
  }

  if (isLoading) {
    return (
      <button disabled className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg">
        Loading...
      </button>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        {isConnected ? (
          <>
            <span className="text-green-600 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Connected to Instagram
            </span>
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={handleConnect}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Connect Instagram
          </button>
        )}
      </div>
      
      <button
        onClick={handleDebug}
        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        Debug Connection
      </button>

      {debugInfo && (
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      )}
    </div>
  )
} 