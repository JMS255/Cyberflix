'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Play, Info, Star } from 'lucide-react'
import type { Movie } from '@/lib/types'
import { BACKDROP_ORIG } from '@/lib/tmdb'

interface HeroProps {
  movie: Movie
}

export default function Hero({ movie }: HeroProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const router = useRouter()

  const title = movie.title ?? movie.name ?? 'Unknown'
  const year = (movie.release_date ?? movie.first_air_date)?.slice(0, 4)
  const type = movie.media_type === 'tv' ? 'tv' : 'movie'
  const backdropUrl = movie.backdrop_path ? `${BACKDROP_ORIG}${movie.backdrop_path}` : null

  return (
    <section className="relative w-full h-[85vh] min-h-[520px] overflow-hidden bg-cyber-bg">
      {/* Backdrop */}
      {backdropUrl && (
        <>
          <Image
            src={backdropUrl}
            alt={title}
            fill
            priority
            className={`object-cover object-top transition-opacity duration-700 ${imgLoaded ? 'opacity-60' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
            sizes="100vw"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-bg via-cyber-bg/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-bg via-transparent to-transparent" />
          {/* Purple tint */}
          <div className="absolute inset-0 bg-cyber-accent/5" />
        </>
      )}

      {/* Skeleton shimmer while loading */}
      {!imgLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-bg via-cyber-card to-cyber-bg animate-shimmer bg-[length:2000px_100%]" />
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-3xl animate-fadeIn">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-cyber-accent/20 border border-cyber-accent/40 text-cyber-accentLight text-xs font-semibold uppercase tracking-widest">
            {type === 'tv' ? 'TV Series' : 'Movie'} · Trending
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-3 drop-shadow-2xl">
          {title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-300">
          {year && <span>{year}</span>}
          {movie.vote_average > 0 && (
            <span className="flex items-center gap-1 text-yellow-400 font-semibold">
              <Star size={14} fill="currentColor" />
              {movie.vote_average.toFixed(1)}
            </span>
          )}
          <span className="text-gray-500">·</span>
          <span className="text-cyber-accentLight">{movie.vote_count.toLocaleString()} votes</span>
        </div>

        {/* Overview */}
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 line-clamp-3 max-w-xl">
          {movie.overview}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() => router.push(`/${type}/${movie.id}`)}
            className="flex items-center gap-2 px-8 py-3 bg-cyber-accent hover:bg-cyber-accentDark text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-cyber-accent/40 hover:shadow-cyber-accent/60 hover:scale-105 active:scale-95 text-sm"
          >
            <Play size={18} fill="currentColor" />
            Play Now
          </button>
          <button
            onClick={() => router.push(`/${type}/${movie.id}`)}
            className="flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition-all duration-200 backdrop-blur-sm text-sm hover:scale-105 active:scale-95"
          >
            <Info size={18} />
            More Info
          </button>
        </div>
      </div>

      {/* Bottom edge fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyber-bg to-transparent pointer-events-none" />
    </section>
  )
}
