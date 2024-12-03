'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function ConfirmEmail() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  // Handle expired or invalid links
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  const handleResendConfirmation = async () => {
    if (!email) {
      setMessage('Please enter your email')
      return
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
      })

      if (error) throw error

      setMessage('New confirmation email sent! Please check your inbox.')
    } catch (error: any) {
      setMessage(error.message)
    }
  }

  // If there's an error, show the resend form
  if (error === 'access_denied') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold text-red-600">Link Expired</h1>
          <p className="text-gray-600">
            {error_description}. Please request a new confirmation email.
          </p>
          
          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleResendConfirmation}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Resend Confirmation Email
            </button>
            {message && <p className="text-red-500">{message}</p>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Email Confirmation</h1>
        <p>Processing your confirmation...</p>
        <button
          onClick={async () => {
            const email = prompt('Please enter your email to receive a new confirmation link:')
            if (email) {
              const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email.trim(),
              })
              
              if (error) {
                alert('Error sending confirmation email: ' + error.message)
              } else {
                alert('New confirmation email sent! Please check your inbox.')
              }
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Resend Confirmation Email
        </button>
      </div>
    </div>
  )
} 