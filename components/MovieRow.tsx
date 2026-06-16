'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MovieCard from './MovieCard'
import type { Movie, MediaType } from '@/lib/types'

interface MovieRowProps {
  title: string
  movies: Movie[]
  defaultType?: MediaType
  showRanks?: boolean
}

const SLIDE_EASE: [number,number,number,number] = [0.77, 0, 0.175, 1]

export default function MovieRow({ title, movies, defaultType = 'movie', showRanks = false }: MovieRowProps) {
  const rowRef        = useRef<HTMLDivElement>(null)
  const [cpp, setCpp] = useState(6)           // cards per page
  const [page, setPage]     = useState(0)
  const [hasPrev, setHasPrev] = useState(false)
  const [rowHov, setRowHov] = useState(false)
  const [hovIdx, setHovIdx] = useState<number | null>(null)

  /* ── Responsive cards-per-page ── */
  const calcCpp = useCallback(() => {
    const w = rowRef.current?.offsetWidth ?? window.innerWidth
    setCpp(w >= 1400 ? 6 : w >= 1100 ? 5 : w >= 800 ? 4 : w >= 550 ? 3 : 2)
  }, [])

  useEffect(() => {
    calcCpp()
    window.addEventListener('resize', calcCpp)
    return () => window.removeEventListener('resize', calcCpp)
  }, [calcCpp])

  const totalPages = Math.ceil(movies.length / cpp)
  const canNext    = page < totalPages - 1
  const canPrev    = hasPrev

  const goNext = () => {
    if (!canNext) return
    setPage(p => p + 1)
    setHasPrev(true)
  }
  const goPrev = () => {
    if (!canPrev) return
    setPage(p => { const np = Math.max(0, p - 1); if (np === 0) setHasPrev(false); return np })
  }

  /* Translate % = -(page * 100%) — moves the track left page-by-page */
  const translatePct = -(page * 100)

  /* Edge detection: first or last card per visible page */
  const edge = (globalIdx: number): 'left' | 'right' | 'center' => {
    const posInPage = globalIdx % cpp
    if (posInPage === 0)       return 'left'
    if (posInPage === cpp - 1) return 'right'
    return 'center'
  }

  /* Sibling push amount when a card is hovered */
  const pushX = (globalIdx: number): string => {
    if (hovIdx === null) return '0%'
    if (globalIdx < hovIdx) return '-8%'
    if (globalIdx > hovIdx) return '8%'
    return '0%'
  }

  if (!movies.length) return null

  return (
    <section
      ref={rowRef}
      className="relative py-1 group/row"
      style={{ zIndex: hovIdx !== null ? 20 : 1 }}
      onMouseEnter={() => setRowHov(true)}
      onMouseLeave={() => { setRowHov(false); setHovIdx(null) }}
    >
      {/* ── Row title + pagination dots ── */}
      <div className="px-4 md:px-[60px] mb-2 flex items-center justify-between h-8">
        <div className="flex items-center gap-3">
          <h2 className="text-[13px] sm:text-[15px] font-bold text-white tracking-wide">{title}</h2>
          <motion.span
            animate={{ opacity: rowHov ? 1 : 0, x: rowHov ? 0 : -6 }}
            transition={{ duration: 0.2 }}
            className="text-[11px] font-semibold text-[#54b9c5] flex items-center gap-0.5 cursor-pointer whitespace-nowrap"
          >
            Explore All <ChevronRight size={11} />
          </motion.span>
        </div>

        {/* Page dots */}
        <AnimatePresence>
          {rowHov && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex gap-1 items-center"
            >
              {Array.from({ length: totalPages }).map((_, i) => (
                <div
                  key={i}
                  className={`h-[2px] w-3 transition-colors duration-200 ${i === page ? 'bg-gray-300' : 'bg-gray-600'}`}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Slider ──
          IMPORTANT: overflow:visible so scaled cards bleed above/below.
          Left/right clipping is handled by the parent page padding (60px) acting
          as a natural boundary — same technique Netflix uses. */}
      <div className="relative" style={{ overflow: 'visible' }}>

        {/* Left arrow */}
        <AnimatePresence>
          {canPrev && rowHov && (
            <motion.button
              key="left-arrow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={goPrev}
              className="absolute left-0 top-0 bottom-0 z-30 w-[60px] flex items-center justify-center
                         bg-black/50 hover:bg-black/70 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft size={32} className="text-white drop-shadow" strokeWidth={2} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Right arrow */}
        <AnimatePresence>
          {canNext && rowHov && (
            <motion.button
              key="right-arrow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={goNext}
              className="absolute right-0 top-0 bottom-0 z-30 w-[60px] flex items-center justify-center
                         bg-black/50 hover:bg-black/70 transition-colors"
              aria-label="Next"
            >
              <ChevronRight size={32} className="text-white drop-shadow" strokeWidth={2} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Clip container — hides horizontal overflow but NOT vertical */}
        <div style={{ overflow: 'hidden', paddingTop: '2%', paddingBottom: '2%', marginTop: '-2%', marginBottom: '-2%' }}>
          {/* Scrollable track — full width of all pages */}
          <motion.div
            className="flex px-4 md:px-[60px]"
            style={{ gap: '2px', width: `${totalPages * 100}%` }}
            animate={{ x: `${translatePct / totalPages}%` }}
            transition={{ duration: 0.55, ease: SLIDE_EASE }}
          >
            {movies.map((movie, i) => (
              <motion.div
                key={movie.id}
                style={{
                  width: `${100 / (cpp * totalPages)}%`,
                  flexShrink: 0,
                  position: 'relative',
                  zIndex: hovIdx === i ? 40 : 1,
                }}
                animate={{ x: pushX(i) }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
              >
                <MovieCard
                  movie={movie}
                  defaultType={defaultType}
                  rank={showRanks ? i + 1 : undefined}
                  edge={edge(i)}
                  onHoverChange={h => setHovIdx(h ? i : null)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as [number,number,number,number]
