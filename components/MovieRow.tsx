'use client'

import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MovieCard from './MovieCard'
import type { Movie, MediaType } from '@/lib/types'

interface MovieRowProps {
  title: string
  movies: Movie[]
  defaultType?: MediaType
}

export default function MovieRow({ title, movies, defaultType = 'movie' }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.75
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  const onScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
  }

  if (!movies.length) return null

  return (
    <section className="relative group/row py-2">
      {/* Row title */}
      <h2 className="px-6 sm:px-12 lg:px-20 text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-3">
        <span className="w-1 h-5 bg-cyber-accent rounded-full inline-block" />
        {title}
      </h2>

      {/* Scroll container */}
      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-cyber-bg/90 border border-cyber-border text-white flex items-center justify-center shadow-lg shadow-black/60 transition-all duration-200 hover:bg-cyber-card hover:border-cyber-accent/60 hover:shadow-cyber-accent/20 ${
            canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } group-hover/row:opacity-100`}
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Cards */}
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-6 sm:px-12 lg:px-20 pb-2 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} defaultType={defaultType} />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-cyber-bg/90 border border-cyber-border text-white flex items-center justify-center shadow-lg shadow-black/60 transition-all duration-200 hover:bg-cyber-card hover:border-cyber-accent/60 hover:shadow-cyber-accent/20 ${
            canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } group-hover/row:opacity-100`}
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>

        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-2 w-10 bg-gradient-to-r from-cyber-bg to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-2 w-10 bg-gradient-to-l from-cyber-bg to-transparent pointer-events-none z-10" />
      </div>
    </section>
  )
}
