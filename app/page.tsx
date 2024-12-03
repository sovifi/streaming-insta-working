'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Social Stream Analytics
        </h1>
        <p className="text-xl text-gray-600 max-w-[600px]">
          Track your social media engagement and streaming analytics in one place.
        </p>
        <div className="space-x-4">
          <Link 
            href="/auth/signup" 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/auth/login"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
} 