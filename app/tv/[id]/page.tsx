export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Star, Tv2, Calendar, Layers, ArrowLeft } from 'lucide-react'
import { getTVDetails, getTVByGenre, getTVSeasons, BACKDROP_ORIG, POSTER_MD } from '@/lib/tmdb'
import VideoPlayer from '@/components/VideoPlayer'
import MovieRow from '@/components/MovieRow'

interface Params { id: string }

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  try {
    const { id } = await params
    const show = await getTVDetails(Number(id))
    return { title: `${show.name ?? 'TV Show'} — CyberFlix`, description: show.overview }
  } catch {
    return { title: 'TV Show — CyberFlix' }
  }
}

export default async function TVPage({ params }: { params: Promise<Params> }) {
  const { id: rawId } = await params
  const id = Number(rawId)
  if (isNaN(id)) notFound()

  let show
  try {
    show = await getTVDetails(id)
  } catch {
    notFound()
  }

  const totalSeasons = show.number_of_seasons ?? 1
  const seasonNums = Array.from({ length: Math.min(totalSeasons, 10) }, (_, i) => i + 1)

  const [seasons, related] = await Promise.all([
    getTVSeasons(id, seasonNums),
    show.genres?.[0]?.id ? getTVByGenre(show.genres[0].id) : Promise.resolve(null),
  ])

  const backdropUrl = show.backdrop_path ? `${BACKDROP_ORIG}${show.backdrop_path}` : null
  const posterUrl = show.poster_path ? `${POSTER_MD}${show.poster_path}` : null
  const year = show.first_air_date?.slice(0, 4)
  const rating = show.vote_average?.toFixed(1)

  return (
    <div className="min-h-screen bg-[#0a051b]">
      {/* Backdrop */}
      <div className="relative h-[50vh] min-h-[320px] overflow-hidden">
        {backdropUrl
          ? <Image src={backdropUrl} alt={show.name ?? ''} fill priority className="object-cover object-top opacity-40" sizes="100vw" />
          : <div className="absolute inset-0 bg-[#12082a]" />
        }
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a051b]/60 to-[#0a051b]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a051b]/80 to-transparent" />
        <Link href="/"
          className="absolute top-20 left-6 md:left-12 flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Browse
        </Link>
      </div>

      {/* Main */}
      <div className="relative z-10 -mt-48 px-4 md:px-12 max-w-screen-xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-8 mb-10">
          {/* Poster */}
          <div className="shrink-0 w-36 sm:w-48 rounded-lg overflow-hidden border border-white/10 shadow-2xl self-start">
            {posterUrl
              ? <Image src={posterUrl} alt={show.name ?? 'Poster'} width={192} height={288} className="w-full h-auto" />
              : <div className="aspect-[2/3] bg-[#12082a] flex items-center justify-center"><Tv2 size={40} className="text-gray-600" /></div>
            }
          </div>

          {/* Info */}
          <div className="flex-1">
            {show.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {show.genres.map(g => (
                  <span key={g.id} className="px-3 py-1 rounded-full bg-cyber-accent/15 border border-cyber-accent/30 text-cyber-accentLight text-xs font-semibold">
                    {g.name}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-1">{show.name}</h1>
            {show.tagline && <p className="text-cyber-accentLight italic text-sm mb-4">&ldquo;{show.tagline}&rdquo;</p>}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-5">
              {rating && Number(rating) > 0 && (
                <span className="flex items-center gap-1.5 text-yellow-400 font-bold">
                  <Star size={14} fill="currentColor" />{rating}
                  <span className="text-gray-600 font-normal text-xs">/ 10</span>
                </span>
              )}
              {year && <span className="flex items-center gap-1.5"><Calendar size={13} className="text-cyber-accent" />{year}</span>}
              {show.number_of_seasons && (
                <span className="flex items-center gap-1.5">
                  <Layers size={13} className="text-cyber-accent" />
                  {show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}
                </span>
              )}
              {show.number_of_episodes && (
                <span className="flex items-center gap-1.5">
                  <Tv2 size={13} className="text-cyber-accent" />
                  {show.number_of_episodes} Episodes
                </span>
              )}
              {show.status && (
                <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${
                  show.status === 'Returning Series'
                    ? 'bg-green-900/30 border-green-700/40 text-green-400'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}>{show.status}</span>
              )}
            </div>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base max-w-2xl">
              {show.overview || 'No description available.'}
            </p>
          </div>
        </div>

        {/* ── Video player ── */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-cyber-accent rounded-full inline-block" />
            Watch Now
          </h2>
          <VideoPlayer tmdbId={id} mediaType="tv" seasons={seasons} />
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
