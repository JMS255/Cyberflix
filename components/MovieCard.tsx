'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Play, Star, Tv2, Film } from 'lucide-react'
import type { Movie } from '@/lib/types'
import { POSTER_MD } from '@/lib/tmdb'

interface MovieCardProps {
  movie: Movie
  defaultType?: 'movie' | 'tv'
}

export default function MovieCard({ movie, defaultType = 'movie' }: MovieCardProps) {
  const [hovered, setHovered] = useState(false)
  const router = useRouter()

  const title = movie.title ?? movie.name ?? 'Unknown'
  const type = movie.media_type === 'tv' ? 'tv' : defaultType
  const year = (movie.release_date ?? movie.first_air_date)?.slice(0, 4)
  const posterUrl = movie.poster_path ? `${POSTER_MD}${movie.poster_path}` : null

  const handleClick = () => router.push(`/${type}/${movie.id}`)

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative shrink-0 w-36 sm:w-44 cursor-pointer group rounded-xl overflow-hidden bg-cyber-card border border-cyber-border/50 transition-all duration-300 hover:scale-105 hover:border-cyber-accent/50 hover:shadow-xl hover:shadow-cyber-accent/20 hover:z-10"
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
      aria-label={`Watch ${title}`}
    >
      {/* Poster */}
      <div className="aspect-[2/3] relative bg-cyber-bg overflow-hidden">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 144px, 176px"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-600">
            {type === 'tv' ? <Tv2 size={32} /> : <Film size={32} />}
            <span className="text-xs text-center px-2 leading-tight">{title}</span>
          </div>
        )}

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-cyber-bg via-cyber-bg/60 to-transparent transition-opacity duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Play button on hover */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-cyber-accent/90 flex items-center justify-center shadow-lg shadow-cyber-accent/50 backdrop-blur-sm">
            <Play size={20} fill="white" className="text-white ml-0.5" />
          </div>
        </div>

        {/* Media type badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
            type === 'tv'
              ? 'bg-cyber-accent/90 text-white'
              : 'bg-black/70 text-gray-300'
          }`}>
            {type === 'tv' ? 'TV' : 'Film'}
          </span>
        </div>
      </div>

      {/* Info strip at bottom (always visible) */}
      <div className="px-2 py-2">
        <p className="text-xs font-semibold text-white truncate leading-tight">{title}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-gray-500">{year ?? '—'}</span>
          {movie.vote_average > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-yellow-400 font-semibold">
              <Star size={9} fill="currentColor" />
              {movie.vote_average.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      {/* Neon glow border on hover */}
      <div
        className={`absolute inset-0 rounded-xl border-2 pointer-events-none transition-all duration-300 ${
          hovered ? 'border-cyber-accent/60 shadow-inner' : 'border-transparent'
        }`}
      />
    </div>
  )
}
