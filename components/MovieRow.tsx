'use client'

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MovieCard from './MovieCard'
import type { Movie, MediaType } from '@/lib/types'

interface MovieRowProps {
  title: string
  movies: Movie[]
  defaultType?: MediaType
  showRanks?: boolean
}

export default function MovieRow({ title, movies, defaultType = 'movie', showRanks = false }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [cardW, setCardW] = useState(180)

  // Calculate card width based on container width (Netflix shows ~6 per row on desktop)
  useEffect(() => {
    const calc = () => {
      if (!scrollRef.current) return
      const containerW = scrollRef.current.parentElement?.clientWidth ?? 0
      const padding = 96 // px-12 * 2
      const gap = 4
      const count = containerW >= 1280 ? 6 : containerW >= 1024 ? 5 : containerW >= 768 ? 4 : 3
      setCardW(Math.floor((containerW - padding - gap * (count - 1)) / count))
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  const onScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanLeft(scrollLeft > 2)
    setCanRight(scrollLeft + clientWidth < scrollWidth - 2)
  }

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -scrollRef.current.clientWidth : scrollRef.current.clientWidth,
      behavior: 'smooth',
    })
  }

  if (!movies.length) return null

  return (
    <section
      className="relative py-2 group/row"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Row title */}
      <div className="px-4 md:px-12 mb-2 flex items-center gap-3">
        <h2 className="text-sm sm:text-base font-bold text-white">{title}</h2>
        <span className={`text-xs font-semibold text-cyber-accent flex items-center gap-1 transition-all duration-300 ${hovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
          Explore All <ChevronRight size={12} />
        </span>
      </div>

      {/* Scroll area */}
      <div className="relative overflow-hidden">
        {/* Left arrow — Netflix full-height panel */}
        <div
          className={`absolute left-0 top-0 bottom-0 z-20 w-12 flex items-center justify-center
            bg-gradient-to-r from-[#0a051b] to-transparent cursor-pointer
            transition-opacity duration-200
            ${canLeft && hovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => scroll('left')}
        >
          <ChevronLeft size={32} className="text-white drop-shadow-lg" strokeWidth={2.5} />
        </div>

        {/* Cards */}
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex gap-1 overflow-x-scroll scrollbar-hide px-4 md:px-12 pb-1"
          style={{ ['--card-w' as string]: `${cardW}px` }}
        >
          {movies.map((movie, i) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              defaultType={defaultType}
              rank={showRanks ? i + 1 : undefined}
            />
          ))}
        </div>

        {/* Right arrow */}
        <div
          className={`absolute right-0 top-0 bottom-0 z-20 w-12 flex items-center justify-center
            bg-gradient-to-l from-[#0a051b] to-transparent cursor-pointer
            transition-opacity duration-200
            ${canRight && hovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => scroll('right')}
        >
          <ChevronRight size={32} className="text-white drop-shadow-lg" strokeWidth={2.5} />
        </div>
      </div>
    </section>
  )
}
