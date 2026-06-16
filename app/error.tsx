'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-cyber-bg flex flex-col items-center justify-center text-center px-4">
      <div className="mb-6 p-5 rounded-2xl bg-cyber-card border border-red-900/40 shadow-xl shadow-red-900/10">
        <AlertTriangle size={48} className="text-red-400" />
      </div>
      <h1 className="text-2xl font-black text-white mb-2">Something went wrong</h1>
      <p className="text-gray-400 text-sm max-w-sm mb-2">
        Could not load content. Make sure your TMDB API key is configured correctly.
      </p>
      {error?.digest && (
        <p className="text-gray-600 text-xs mb-8 font-mono">Error: {error.digest}</p>
      )}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-5 py-2.5 bg-cyber-accent hover:bg-cyber-accentDark text-white font-semibold rounded-xl transition-all hover:scale-105 text-sm shadow-lg shadow-cyber-accent/30"
        >
          <RefreshCw size={15} />
          Try Again
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 bg-cyber-card border border-cyber-border text-gray-300 hover:text-white font-semibold rounded-xl transition-all hover:scale-105 text-sm"
        >
          <Home size={15} />
          Home
        </Link>
      </div>
    </div>
  )
}
