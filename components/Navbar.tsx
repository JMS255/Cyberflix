'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Bell, ChevronDown, X } from 'lucide-react'
import { searchMulti } from '@/lib/tmdb'
import { POSTER_SM } from '@/lib/tmdb'
import type { Movie } from '@/lib/types'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'TV Shows', href: '/?tab=tv' },
  { label: 'Movies', href: '/?tab=movies' },
  { label: 'New & Popular', href: '/?tab=new' },
  { label: 'My List', href: '/?tab=list' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    try {
      const data = await searchMulti(q)
      setResults(data.results.filter(r => r.media_type !== 'person').slice(0, 6))
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
    closeSearch()
    router.push(`/${r.media_type === 'tv' ? 'tv' : 'movie'}/${r.id}`)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0a051b]' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="px-4 md:px-12 h-[68px] flex items-center gap-6">

        {/* Logo */}
        <Link href="/" className="shrink-0 text-2xl font-black tracking-tighter text-cyber-accent select-none">
          CYBERFLIX
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-5 text-sm text-gray-300">
          {NAV_LINKS.map(l => (
            <Link key={l.label} href={l.href} className="hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile browse dropdown */}
        <button
          className="md:hidden flex items-center gap-1 text-sm text-white"
          onClick={() => setMobileOpen(v => !v)}
        >
          Browse <ChevronDown size={14} className={`transition-transform ${mobileOpen ? 'rotate-180' : ''}`} />
        </button>
        {mobileOpen && (
          <div className="absolute top-[68px] left-4 bg-black/95 border border-gray-700 rounded-md py-2 z-50 min-w-[160px]">
            {NAV_LINKS.map(l => (
              <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="ml-auto flex items-center gap-4 relative">

          {/* Search */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center gap-2 border border-white/60 bg-black/80 px-3 py-1.5 backdrop-blur-sm">
                <Search size={15} className="text-white shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Titles, people, genres"
                  className="bg-transparent text-sm text-white placeholder-gray-400 outline-none w-52"
                  onKeyDown={e => e.key === 'Escape' && closeSearch()}
                />
                {loading && <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin shrink-0" />}
                <button onClick={closeSearch}><X size={14} className="text-gray-400 hover:text-white" /></button>
              </div>
            ) : (
              <button onClick={openSearch} className="text-white hover:text-gray-300 transition-colors">
                <Search size={20} />
              </button>
            )}

            {/* Search results dropdown */}
            {searchOpen && results.length > 0 && (
              <div className="absolute right-0 top-full mt-1 w-80 bg-[#0a051b] border border-gray-700 shadow-2xl z-50">
                {results.map(r => (
                  <button key={r.id} onClick={() => goTo(r)}
                    className="flex items-center gap-3 w-full px-3 py-2 hover:bg-white/5 transition-colors text-left group">
                    <div className="w-12 h-8 shrink-0 bg-gray-800 overflow-hidden">
                      {r.backdrop_path && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`${POSTER_SM}${r.backdrop_path}`} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{r.title ?? r.name}</p>
                      <p className="text-xs text-gray-500">{r.media_type === 'tv' ? 'TV Show' : 'Movie'} · {(r.release_date ?? r.first_air_date)?.slice(0, 4)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification bell */}
          <button className="relative text-white hover:text-gray-300 transition-colors hidden sm:block">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyber-accent rounded-full" />
          </button>

          {/* Profile avatar */}
          <div className="flex items-center gap-1 cursor-pointer group">
            <div className="w-8 h-8 rounded bg-cyber-accent flex items-center justify-center text-white text-sm font-bold select-none">
              C
            </div>
            <ChevronDown size={14} className="text-white group-hover:rotate-180 transition-transform duration-200 hidden sm:block" />
          </div>

        </div>
      </div>
    </nav>
  )
}
