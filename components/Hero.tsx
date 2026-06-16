'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Play, Info } from 'lucide-react'
import type { Movie } from '@/lib/types'
import { BACKDROP_ORIG } from '@/lib/tmdb'

interface HeroProps {
  movie: Movie
}

export default function Hero({ movie }: HeroProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const router = useRouter()

  const title = movie.title ?? movie.name ?? ''
  const type = movie.media_type === 'tv' ? 'tv' : 'movie'
  const backdropUrl = movie.backdrop_path ? `${BACKDROP_ORIG}${movie.backdrop_path}` : null

  return (
    <section className="relative w-full h-[56.25vw] min-h-[480px] max-h-[800px] overflow-hidden bg-cyber-bg">
      {backdropUrl && (
        <>
          <Image
            src={backdropUrl}
            alt={title}
            fill
            priority
            className={`object-cover object-center transition-opacity duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
            sizes="100vw"
          />
          {/* Netflix-style gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a051b] via-[#0a051b]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a051b] via-transparent to-transparent" />
          {/* Slight purple tint */}
          <div className="absolute inset-0 bg-cyber-accent/[0.04]" />
        </>
      )}

      {/* Content — bottom-left aligned like Netflix */}
      <div className="absolute bottom-[20%] left-0 px-4 md:px-12 max-w-2xl animate-fadeIn">
        {/* Title — large bold */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-none mb-4 drop-shadow-2xl">
          {title}
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-200 leading-relaxed line-clamp-3 mb-6 drop-shadow-lg max-w-lg">
          {movie.overview}
        </p>

        {/* Buttons — Netflix style */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/${type}/${movie.id}`)}
            className="flex items-center gap-2 px-8 py-2.5 bg-white hover:bg-gray-200 text-black font-bold rounded text-sm transition-colors"
          >
            <Play size={20} fill="black" />
            Play
          </button>
          <button
            onClick={() => router.push(`/${type}/${movie.id}`)}
            className="flex items-center gap-2 px-8 py-2.5 bg-gray-500/70 hover:bg-gray-500/60 text-white font-bold rounded text-sm transition-colors backdrop-blur-sm"
          >
            <Info size={20} />
            More Info
          </button>
        </div>
      </div>

      {/* Age rating - bottom right */}
      <div className="absolute bottom-[22%] right-0 md:right-12 flex items-center gap-3">
        <div className="border-l-2 border-gray-400 pl-3 py-1">
          <span className="text-gray-300 text-sm">18+</span>
        </div>
      </div>

      {/* Bottom fade into content */}
      <div className="absolute bottom-0 left-0 right-0 h-[14vw] bg-gradient-to-t from-[#0a051b] to-transparent pointer-events-none" />
    </section>
  )
}
