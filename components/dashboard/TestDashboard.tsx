'use client'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function TestDashboard() {
  const [connectionTest, setConnectionTest] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getUser()
  }, [supabase])

  const testConnection = async () => {
    try {
      // First, log the current user
      console.log('Current user ID:', userId);

      const { data, error } = await supabase
        .from('platform_connections')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      console.log('Connection test:', { data, error });
      setConnectionTest({ data, error });
    } catch (e) {
      console.error('Test error:', e);
      setConnectionTest({ error: e });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p>User ID: {userId || 'Loading...'}</p>
              <Button 
                onClick={testConnection}
                className="mt-4"
              >
                Test Database Connection
              </Button>
            </div>

            {connectionTest && (
              <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
                {JSON.stringify(connectionTest, null, 2)}
              </pre>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 