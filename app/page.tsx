export const dynamic = 'force-dynamic'

import Hero from '@/components/Hero'
import MovieRow from '@/components/MovieRow'
import {
  getTrending,
  getNowPlaying,
  getTopRatedMovies,
  getTopRatedTV,
  getPopularTV,
  getMoviesByGenre,
  getTVByGenre,
} from '@/lib/tmdb'

// TMDB genre IDs for quick reference
const GENRE = {
  ACTION: 28,
  COMEDY: 35,
  HORROR: 27,
  SCIFI: 878,
  ANIMATION: 16,
  CRIME: 80,
  DRAMA: 18,
} as const

export default async function HomePage() {
  const [
    trendingAll,
    nowPlaying,
    topMovies,
    topTV,
    popularTV,
    actionMovies,
    scifiMovies,
    crimeTV,
    animeTV,
  ] = await Promise.all([
    getTrending('all', 'week'),
    getNowPlaying(),
    getTopRatedMovies(),
    getTopRatedTV(),
    getPopularTV(),
    getMoviesByGenre(GENRE.ACTION),
    getMoviesByGenre(GENRE.SCIFI),
    getTVByGenre(GENRE.CRIME),
    getTVByGenre(GENRE.ANIMATION),
  ])

  const heroMovie = trendingAll.results.find(m => m.backdrop_path) ?? trendingAll.results[0]

  return (
    <div className="bg-cyber-bg">
      {/* Hero banner */}
      <Hero movie={heroMovie} />

      {/* Content rows */}
      <div className="relative z-10 -mt-16 space-y-8 pb-12">
        <MovieRow
          title="Trending This Week"
          movies={trendingAll.results}
          defaultType="movie"
        />
        <MovieRow
          title="Now Playing in Cinemas"
          movies={nowPlaying.results}
          defaultType="movie"
        />
        <MovieRow
          title="Top Rated Movies"
          movies={topMovies.results}
          defaultType="movie"
        />
        <MovieRow
          title="Popular TV Shows"
          movies={popularTV.results}
          defaultType="tv"
        />
        <MovieRow
          title="Top Rated TV"
          movies={topTV.results}
          defaultType="tv"
        />
        <MovieRow
          title="Action Blockbusters"
          movies={actionMovies.results}
          defaultType="movie"
        />
        <MovieRow
          title="Sci-Fi &amp; Fantasy"
          movies={scifiMovies.results}
          defaultType="movie"
        />
        <MovieRow
          title="Crime &amp; Thriller Series"
          movies={crimeTV.results}
          defaultType="tv"
        />
        <MovieRow
          title="Anime &amp; Animation"
          movies={animeTV.results}
          defaultType="tv"
        />
      </div>
    </div>
  )
}
