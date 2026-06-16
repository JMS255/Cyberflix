export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Star, Tv2, Calendar, Layers, ArrowLeft } from 'lucide-react'
import { getTVDetails, getTVByGenre, BACKDROP_ORIG, POSTER_MD } from '@/lib/tmdb'
import VideoPlayer from '@/components/VideoPlayer'
import MovieRow from '@/components/MovieRow'

interface Params {
  id: string
}

export async function generateMetadata({ params }: { params: Params }) {
  try {
    const show = await getTVDetails(Number(params.id))
    return {
      title: `${show.name ?? 'TV Show'} — CyberFlix`,
      description: show.overview,
    }
  } catch {
    return { title: 'TV Show — CyberFlix' }
  }
}

export default async function TVPage({ params }: { params: Params }) {
  const id = Number(params.id)
  if (isNaN(id)) notFound()

  let show
  try {
    show = await getTVDetails(id)
  } catch {
    notFound()
  }

  const primaryGenreId = show.genres?.[0]?.id
  const related = primaryGenreId ? await getTVByGenre(primaryGenreId) : null

  const backdropUrl = show.backdrop_path ? `${BACKDROP_ORIG}${show.backdrop_path}` : null
  const posterUrl = show.poster_path ? `${POSTER_MD}${show.poster_path}` : null
  const year = show.first_air_date?.slice(0, 4)
  const rating = show.vote_average?.toFixed(1)
  const episodeRuntime = show.episode_run_time?.[0]

  return (
    <div className="min-h-screen bg-cyber-bg">
      {/* Backdrop hero */}
      <div className="relative h-[50vh] min-h-[320px] overflow-hidden">
        {backdropUrl ? (
          <Image
            src={backdropUrl}
            alt={show.name ?? 'Show backdrop'}
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
                alt={show.name ?? 'Poster'}
                width={208}
                height={312}
                className="w-full h-auto"
              />
            ) : (
              <div className="aspect-[2/3] bg-cyber-card flex items-center justify-center">
                <Tv2 size={48} className="text-gray-600" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 animate-fadeIn">
            {/* Genres */}
            {show.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {show.genres.map(g => (
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
              {show.name}
            </h1>

            {show.tagline && (
              <p className="text-cyber-accentLight italic text-sm mb-4">&ldquo;{show.tagline}&rdquo;</p>
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
              {show.number_of_seasons && (
                <span className="flex items-center gap-1.5">
                  <Layers size={14} className="text-cyber-accent" />
                  {show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}
                </span>
              )}
              {show.number_of_episodes && (
                <span className="flex items-center gap-1.5">
                  <Tv2 size={14} className="text-cyber-accent" />
                  {show.number_of_episodes} Episodes
                </span>
              )}
              {episodeRuntime && (
                <span className="text-gray-500 text-xs">~{episodeRuntime}min / ep</span>
              )}
              {show.status && (
                <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${
                  show.status === 'Returning Series'
                    ? 'bg-green-900/30 border-green-700/40 text-green-400'
                    : 'bg-cyber-card border-cyber-border text-gray-400'
                }`}>
                  {show.status}
                </span>
              )}
            </div>

            {/* Overview */}
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base max-w-2xl">
              {show.overview || 'No description available.'}
            </p>
          </div>
        </div>

        {/* Video player */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-1 h-5 bg-cyber-accent rounded-full" />
            Watch Now
          </h2>
          <VideoPlayer tmdbId={id} mediaType="tv" season={1} episode={1} />
        </div>

        {/* Related */}
        {related && related.results.length > 0 && (
          <MovieRow
            title={`More ${show.genres?.[0]?.name ?? 'TV'} Shows`}
            movies={related.results.filter(m => m.id !== id)}
            defaultType="tv"
          />
        )}
      </div>
    </div>
  )
}
