import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'CyberFlix — Stream Movies & TV',
  description: 'Discover and stream trending movies and TV shows in stunning cyber-purple style.',
  keywords: ['movies', 'tv shows', 'streaming', 'watch online'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cyber-bg min-h-screen">
        <Navbar />
        <main>{children}</main>
        <footer className="mt-20 pb-10 text-center text-xs text-gray-700 px-4">
          <p>CyberFlix uses the{' '}
            <span className="text-cyber-accent">TMDB API</span>{' '}
            but is not endorsed or certified by TMDB.
          </p>
          <p className="mt-1">Video content is sourced from public third-party embeds.</p>
        </footer>
      </body>
    </html>
  )
}
