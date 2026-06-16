'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, X, Tv2, Film } from 'lucide-react'
import { searchMulti } from '@/lib/tmdb'
import type { Movie } from '@/lib/types'
import { POSTER_SM } from '@/lib/tmdb'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    try {
      const data = await searchMulti(q)
      setResults(data.results.filter(r => r.media_type !== 'person').slice(0, 8))
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(query), 350)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, doSearch])

  const openSearch = () => {
    setSearchOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const closeSearch = () => {
    setSearchOpen(false)
    setQuery('')
    setResults([])
  }

  const goTo = (r: Movie) => {
    const type = r.media_type === 'tv' ? 'tv' : 'movie'
    closeSearch()
    router.push(`/${type}/${r.id}`)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cyber-bg/95 backdrop-blur-md border-b border-cyber-border shadow-lg shadow-cyber-accent/10'
          : 'bg-gradient-to-b from-cyber-bg/80 to-transparent'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0" onClick={closeSearch}>
          <div className="w-8 h-8 rounded-lg bg-cyber-accent flex items-center justify-center shadow-lg shadow-cyber-accent/40">
            <Tv2 size={18} className="text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white hidden sm:block">
            <span className="text-cyber-accent">Cyber</span>Flix
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          <Link href="/" className="hover:text-cyber-accentLight transition-colors">Home</Link>
          <Link href="/?tab=movies" className="hover:text-cyber-accentLight transition-colors">Movies</Link>
          <Link href="/?tab=tv" className="hover:text-cyber-accentLight transition-colors">TV Shows</Link>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 ml-auto relative">
          {searchOpen ? (
            <div className="flex items-center gap-2 bg-cyber-card border border-cyber-border rounded-full px-4 py-2 shadow-lg shadow-cyber-accent/20 w-72 sm:w-96 animate-fadeIn">
              <Search size={16} className="text-cyber-accent shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search movies &amp; shows…"
                className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1"
                onKeyDown={e => e.key === 'Escape' && closeSearch()}
              />
              {loading && (
                <div className="w-3 h-3 border-2 border-cyber-accent border-t-transparent rounded-full animate-spin shrink-0" />
              )}
              <button onClick={closeSearch} className="text-gray-400 hover:text-white transition-colors shrink-0">
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={openSearch}
              className="p-2 rounded-full text-gray-300 hover:text-cyber-accent hover:bg-cyber-card transition-all duration-200"
              aria-label="Open search"
            >
              <Search size={20} />
            </button>
          )}

          {/* Dropdown results */}
          {searchOpen && results.length > 0 && (
            <div className="absolute top-full right-0 mt-2 w-72 sm:w-96 bg-cyber-card border border-cyber-border rounded-2xl overflow-hidden shadow-2xl shadow-black/60 animate-fadeIn">
              {results.map(r => (
                <button
                  key={r.id}
                  onClick={() => goTo(r)}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-cyber-cardHover transition-colors text-left group"
                >
                  <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0 bg-cyber-bg border border-cyber-border">
                    {r.poster_path ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`${POSTER_SM}${r.poster_path}`}
                        alt={r.title ?? r.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {r.media_type === 'tv' ? <Tv2 size={16} className="text-gray-500" /> : <Film size={16} className="text-gray-500" />}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate group-hover:text-cyber-accentLight transition-colors">
                      {r.title ?? r.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${r.media_type === 'tv' ? 'bg-cyber-muted text-cyber-accentLight' : 'bg-gray-700 text-gray-300'}`}>
                        {r.media_type === 'tv' ? 'TV' : 'Movie'}
                      </span>
                      {(r.release_date ?? r.first_air_date)?.slice(0, 4)}
                      {r.vote_average > 0 && (
                        <span className="ml-1 text-yellow-400">★ {r.vote_average.toFixed(1)}</span>
                      )}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
