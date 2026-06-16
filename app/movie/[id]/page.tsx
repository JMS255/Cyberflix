export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Star, Clock, Calendar, ArrowLeft, Clapperboard } from 'lucide-react'
import { getMovieDetails, getMoviesByGenre, BACKDROP_ORIG, POSTER_MD } from '@/lib/tmdb'
import VideoPlayer from '@/components/VideoPlayer'
import MovieRow from '@/components/MovieRow'

interface Params {
  id: string
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  try {
    const { id } = await params
    const movie = await getMovieDetails(Number(id))
    return {
      title: `${movie.title ?? 'Movie'} — CyberFlix`,
      description: movie.overview,
    }
  } catch {
    return { title: 'Movie — CyberFlix' }
  }
}

export default async function MoviePage({ params }: { params: Promise<Params> }) {
  const { id: rawId } = await params
  const id = Number(rawId)
  if (isNaN(id)) notFound()

  let movie
  try {
    movie = await getMovieDetails(id)
  } catch {
    notFound()
  }

  const primaryGenreId = movie.genres?.[0]?.id
  const related = primaryGenreId ? await getMoviesByGenre(primaryGenreId) : null

  const backdropUrl = movie.backdrop_path ? `${BACKDROP_ORIG}${movie.backdrop_path}` : null
  const posterUrl = movie.poster_path ? `${POSTER_MD}${movie.poster_path}` : null
  const year = movie.release_date?.slice(0, 4)
  const rating = movie.vote_average?.toFixed(1)
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null

  return (
    <div className="min-h-screen bg-cyber-bg">
      {/* Backdrop hero */}
      <div className="relative h-[50vh] min-h-[320px] overflow-hidden">
        {backdropUrl ? (
          <Image
            src={backdropUrl}
            alt={movie.title ?? 'Movie backdrop'}
            fill
            priority
            className="object-cover object-top opacity-40"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-cyber-card" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-bg/60 to-cyber-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-bg/80 to-transparent" />

        {/* Back */}
        <Link
          href="/"
          className="absolute top-20 left-6 sm:left-12 lg:left-20 flex items-center gap-2 text-sm text-gray-300 hover:text-cyber-accentLight transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Browse
        </Link>
      </div>

      {/* Main content */}
      <div className="relative z-10 -mt-48 px-6 sm:px-12 lg:px-20 max-w-screen-xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-8 mb-10">
          {/* Poster */}
          <div className="shrink-0 w-40 sm:w-52 rounded-2xl overflow-hidden border border-cyber-border shadow-2xl shadow-cyber-accent/20 self-start">
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={movie.title ?? 'Poster'}
                width={208}
                height={312}
                className="w-full h-auto"
              />
            ) : (
              <div className="aspect-[2/3] bg-cyber-card flex items-center justify-center">
                <Clapperboard size={48} className="text-gray-600" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 animate-fadeIn">
            {/* Genres */}
            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map(g => (
                  <span
                    key={g.id}
                    className="px-3 py-1 rounded-full bg-cyber-accent/15 border border-cyber-accent/30 text-cyber-accentLight text-xs font-semibold"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-2">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-cyber-accentLight italic text-sm mb-4">&ldquo;{movie.tagline}&rdquo;</p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
              {rating && Number(rating) > 0 && (
                <span className="flex items-center gap-1.5 text-yellow-400 font-bold">
                  <Star size={15} fill="currentColor" />
                  {rating}
                  <span className="text-gray-600 font-normal text-xs">/ 10</span>
                </span>
              )}
              {year && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-cyber-accent" />
                  {year}
                </span>
              )}
              {runtime && (
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-cyber-accent" />
                  {runtime}
                </span>
              )}
              {movie.status && (
                <span className="px-2 py-0.5 rounded bg-cyber-card border border-cyber-border text-xs">
                  {movie.status}
                </span>
              )}
            </div>

            {/* Overview */}
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base max-w-2xl">
              {movie.overview || 'No description available.'}
            </p>
          </div>
        </div>

        {/* Video player */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-1 h-5 bg-cyber-accent rounded-full" />
            Watch Now
          </h2>
          <VideoPlayer tmdbId={id} mediaType="movie" />
        </div>

        {/* Related */}
        {related && related.results.length > 0 && (
          <MovieRow
            title={`More ${movie.genres?.[0]?.name ?? ''} Movies`}
            movies={related.results.filter(m => m.id !== id)}
            defaultType="movie"
          />
        )}
      </div>
    </div>
  )
}
