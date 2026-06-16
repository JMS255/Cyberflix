'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react'
import type { Movie, MediaType } from '@/lib/types'
import { BACKDROP_LG, POSTER_MD } from '@/lib/tmdb'

/* ─── Preview card (rendered via portal so it escapes overflow:hidden) ─── */

interface Rect { top: number; left: number; width: number; height: number }

interface PreviewProps {
  movie: Movie
  rect: Rect
  type: MediaType
  onClose: () => void
  onNavigate: () => void
  rank?: number
}

function PreviewCard({ movie, rect, type, onClose, onNavigate, rank }: PreviewProps) {
  const title = movie.title ?? movie.name ?? ''
  const year = (movie.release_date ?? movie.first_air_date)?.slice(0, 4)
  const match = Math.min(99, Math.max(50, Math.round(movie.vote_average * 10)))

  const W = Math.max(280, rect.width * 1.5)
  const left = Math.max(8, Math.min(
    typeof window !== 'undefined' ? window.innerWidth - W - 8 : 0,
    rect.left + rect.width / 2 - W / 2
  ))
  const topIdeal = rect.top + rect.height / 2 - (W * 0.5625 + 110) / 2
  const top = Math.max(72, typeof window !== 'undefined'
    ? Math.min(window.innerHeight - (W * 0.5625 + 110) - 8, topIdeal)
    : topIdeal)

  const imgUrl = movie.backdrop_path
    ? `${BACKDROP_LG}${movie.backdrop_path}`
    : movie.poster_path
    ? `${POSTER_MD}${movie.poster_path}`
    : null

  return (
    <div
      className="fixed z-[9999] rounded-md overflow-hidden shadow-2xl shadow-black"
      style={{ top, left, width: W }}
      onMouseEnter={() => {/* keep open */}}
      onMouseLeave={onClose}
      data-preview-card="1"
    >
      {/* Backdrop */}
      <div className="relative" style={{ aspectRatio: '16/9' }}>
        {imgUrl
          ? <Image src={imgUrl} alt={title} fill className="object-cover" sizes="320px" />
          : <div className="w-full h-full bg-gray-900" />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-[#181828] via-transparent to-transparent" />
        {rank !== undefined && (
          <div className="absolute bottom-1 left-2 text-[56px] font-black leading-none select-none"
            style={{ WebkitTextStroke: '3px #8b5cf6', color: 'transparent' }}>
            {rank}
          </div>
        )}
        <p className="absolute bottom-3 right-3 left-3 text-white font-bold text-sm drop-shadow line-clamp-1 text-right">
          {!rank && title}
        </p>
      </div>

      {/* Panel */}
      <div className="bg-[#181828] px-3 pt-3 pb-4">
        {/* Buttons row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button onClick={onNavigate}
              className="w-9 h-9 rounded-full bg-white hover:bg-gray-200 flex items-center justify-center transition-colors">
              <Play size={16} fill="black" className="ml-0.5 text-black" />
            </button>
            <button className="w-9 h-9 rounded-full border-2 border-gray-500 hover:border-white flex items-center justify-center transition-colors">
              <Plus size={16} className="text-white" />
            </button>
            <button className="w-9 h-9 rounded-full border-2 border-gray-500 hover:border-white flex items-center justify-center transition-colors">
              <ThumbsUp size={14} className="text-white" />
            </button>
          </div>
          <button onClick={onNavigate}
            className="w-9 h-9 rounded-full border-2 border-gray-500 hover:border-white flex items-center justify-center transition-colors">
            <ChevronDown size={16} className="text-white" />
          </button>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="text-green-400 font-bold">{match}% Match</span>
          <span className="border border-gray-600 text-gray-400 px-1.5 py-0.5 leading-none text-[10px]">
            {type === 'tv' ? 'TV-MA' : 'PG-13'}
          </span>
          {year && <span className="text-gray-300">{year}</span>}
          <span className="border border-gray-600 text-gray-500 px-1.5 py-0.5 leading-none text-[10px] rounded-sm">HD</span>
          {type === 'tv' && <span className="text-gray-400">Series</span>}
        </div>
      </div>
    </div>
  )
}

/* ─── Base card ─── */

interface MovieCardProps {
  movie: Movie
  defaultType?: MediaType
  rank?: number
}

export default function MovieCard({ movie, defaultType = 'movie', rank }: MovieCardProps) {
  const [rect, setRect] = useState<Rect | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const openTimer = useRef<ReturnType<typeof setTimeout>>()
  const closeTimer = useRef<ReturnType<typeof setTimeout>>()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => { setMounted(true) }, [])

  const type: MediaType = movie.media_type === 'tv' ? 'tv' : defaultType
  const title = movie.title ?? movie.name ?? ''

  const imgUrl = movie.backdrop_path
    ? `${BACKDROP_LG}${movie.backdrop_path}`
    : movie.poster_path
    ? `${POSTER_MD}${movie.poster_path}`
    : null

  const navigate = useCallback(() => {
    router.push(`/${type}/${movie.id}`)
  }, [router, type, movie.id])

  const scheduleOpen = () => {
    clearTimeout(closeTimer.current)
    openTimer.current = setTimeout(() => {
      if (cardRef.current) {
        const r = cardRef.current.getBoundingClientRect()
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
      }
    }, 400)
  }

  const scheduleClose = () => {
    clearTimeout(openTimer.current)
    closeTimer.current = setTimeout(() => setRect(null), 200)
  }

  const cancelClose = () => clearTimeout(closeTimer.current)

  return (
    <>
      <div
        ref={cardRef}
        onClick={navigate}
        onMouseEnter={scheduleOpen}
        onMouseLeave={scheduleClose}
        className="relative shrink-0 cursor-pointer rounded overflow-hidden bg-gray-900 transition-transform duration-200"
        style={{ width: 'var(--card-w, 180px)' }}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && navigate()}
        aria-label={`Watch ${title}`}
      >
        {/* 16:9 image */}
        <div className="aspect-video relative">
          {imgUrl
            ? <Image src={imgUrl} alt={title} fill className="object-cover" sizes="220px" />
            : (
              <div className="w-full h-full bg-cyber-card flex items-center justify-center p-2">
                <span className="text-gray-600 text-[11px] text-center leading-tight">{title}</span>
              </div>
            )
          }
          {rank !== undefined && (
            <div className="absolute bottom-0 left-1 text-[48px] font-black leading-none select-none"
              style={{ WebkitTextStroke: '2px #8b5cf6', color: 'transparent' }}>
              {rank}
            </div>
          )}
        </div>
      </div>

      {mounted && rect && createPortal(
        <PreviewCard
          movie={movie}
          rect={rect}
          type={type}
          rank={rank}
          onClose={() => { scheduleClose(); }}
          onNavigate={navigate}
        />,
        document.body
      )}
    </>
  )
}
