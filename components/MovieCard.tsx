'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react'
import type { Movie, MediaType } from '@/lib/types'
import { BACKDROP_LG, POSTER_MD } from '@/lib/tmdb'

interface MovieCardProps {
  movie: Movie
  defaultType?: MediaType
  rank?: number
  /** Which edge the card sits on — controls transform-origin so it expands inward */
  edge?: 'left' | 'right' | 'center'
  onHoverChange?: (hovered: boolean) => void
}

const SCALE = 1.5
const ENTER_DELAY = 0.28   // seconds before expansion starts
const ENTER_DUR  = 0.3
const EXIT_DUR   = 0.2
const EASE: [number,number,number,number] = [0.25, 0.46, 0.45, 0.94]

const originMap = {
  left:   'left center',
  right:  'right center',
  center: 'center center',
} as const

export default function MovieCard({
  movie,
  defaultType = 'movie',
  rank,
  edge = 'center',
  onHoverChange,
}: MovieCardProps) {
  const [hovered, setHovered] = useState(false)
  const router = useRouter()

  const type: MediaType = movie.media_type === 'tv' ? 'tv' : defaultType
  const title   = movie.title ?? movie.name ?? ''
  const year    = (movie.release_date ?? movie.first_air_date)?.slice(0, 4)
  const match   = Math.min(99, Math.max(50, Math.round(movie.vote_average * 10)))

  const imgUrl = movie.backdrop_path
    ? `${BACKDROP_LG}${movie.backdrop_path}`
    : movie.poster_path ? `${POSTER_MD}${movie.poster_path}` : null

  const navigate = useCallback(() => router.push(`/${type}/${movie.id}`), [router, type, movie.id])

  const onEnter = () => { setHovered(true);  onHoverChange?.(true)  }
  const onLeave = () => { setHovered(false); onHoverChange?.(false) }

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      style={{
        transformOrigin: originMap[edge],
        willChange: 'transform',
        zIndex: hovered ? 40 : 1,
        position: 'relative',
      }}
      animate={{ scale: hovered ? SCALE : 1 }}
      transition={hovered
        ? { duration: ENTER_DUR, delay: ENTER_DELAY, ease: EASE }
        : { duration: EXIT_DUR,  delay: 0,           ease: EASE }
      }
      onHoverStart={onEnter}
      onHoverEnd={onLeave}
      onClick={navigate}
    >
      {/* ── Thumbnail ── */}
      <div className="relative overflow-hidden rounded-sm bg-gray-900" style={{ aspectRatio: '16/9' }}>
        {imgUrl
          ? <Image src={imgUrl} alt={title} fill sizes="220px" className="object-cover pointer-events-none" />
          : <div className="w-full h-full flex items-center justify-center p-2">
              <span className="text-gray-600 text-[11px] text-center leading-tight">{title}</span>
            </div>
        }
        {/* Rank number overlay */}
        {rank !== undefined && (
          <div
            className="absolute bottom-0 left-1 text-[52px] font-black leading-none pointer-events-none"
            style={{ WebkitTextStroke: '3px #8b5cf6', color: 'transparent' }}
          >
            {rank}
          </div>
        )}
        {/* Subtle hover tint */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute inset-0 bg-black/10"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Info panel — slides in below the thumbnail ── */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, delay: 0.05 }}
            className="bg-[#181818] rounded-b-md px-3 pt-3 pb-3.5 border-t border-white/5"
            onClick={e => e.stopPropagation()}
          >
            {/* Action buttons */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={navigate}
                  className="w-8 h-8 rounded-full bg-white hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0"
                  aria-label="Play"
                >
                  <Play size={13} fill="black" className="ml-0.5 text-black" />
                </button>
                <button className="w-8 h-8 rounded-full border-2 border-gray-500 hover:border-white flex items-center justify-center transition-colors shrink-0" aria-label="Add to list">
                  <Plus size={13} className="text-white" />
                </button>
                <button className="w-8 h-8 rounded-full border-2 border-gray-500 hover:border-white flex items-center justify-center transition-colors shrink-0" aria-label="Rate">
                  <ThumbsUp size={11} className="text-white" />
                </button>
              </div>
              <button
                onClick={navigate}
                className="w-8 h-8 rounded-full border-2 border-gray-500 hover:border-white flex items-center justify-center transition-colors shrink-0"
                aria-label="More info"
              >
                <ChevronDown size={13} className="text-white" />
              </button>
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-1.5 text-[11px] flex-wrap">
              <span className="text-green-400 font-semibold">{match}% Match</span>
              <span className="border border-gray-600 text-gray-400 px-1 py-0.5 leading-none">{type === 'tv' ? 'TV-MA' : 'PG-13'}</span>
              {year && <span className="text-gray-300">{year}</span>}
              <span className="border border-gray-600 text-gray-500 px-1 py-0.5 leading-none rounded-sm">HD</span>
              {type === 'tv' && <span className="text-gray-400">Series</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
