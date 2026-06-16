import Link from 'next/link'
import { Tv2, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cyber-bg flex flex-col items-center justify-center text-center px-4">
      <div className="mb-6 p-5 rounded-2xl bg-cyber-card border border-cyber-border shadow-xl shadow-cyber-accent/10">
        <Tv2 size={48} className="text-cyber-accent" />
      </div>
      <h1 className="text-7xl font-black text-cyber-accent mb-2">404</h1>
      <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
      <p className="text-gray-400 text-sm max-w-sm mb-8">
        The title you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 px-6 py-3 bg-cyber-accent hover:bg-cyber-accentDark text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-cyber-accent/30"
      >
        <Home size={18} />
        Back to Browse
      </Link>
    </div>
  )
}
