import InstagramAnalytics from '@/components/InstagramAnalytics'
import InstagramConnect from '@/components/InstagramConnect'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!session) {
    return <div>Please sign in</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      
      <div className="flex items-center gap-2 mb-4">
        <p>{user.email}</p>
        <button className="px-3 py-1 border rounded">Sign Out</button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Instagram</h2>
        <InstagramConnect />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Analytics</h2>
        <InstagramAnalytics userId={user.id} />
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-bold mb-2">Debug Information</h3>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify({
            user: user.email,
            userId: user.id,
          }, null, 2)}
        </pre>
      </div>
    </div>
  )
} 