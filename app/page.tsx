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

const GENRE = {
  ACTION: 28,
  COMEDY: 35,
  HORROR: 27,
  SCIFI: 878,
  ANIMATION: 16,
  CRIME: 80,
  THRILLER: 53,
  ROMANCE: 10749,
} as const

export default async function HomePage() {
  const [
    trendingAll,
    trendingMovies,
    nowPlaying,
    topMovies,
    topTV,
    popularTV,
    actionMovies,
    scifiMovies,
    crimeTV,
    horrorMovies,
    comedies,
    animeTV,
  ] = await Promise.all([
    getTrending('all', 'week'),
    getTrending('movie', 'week'),
    getNowPlaying(),
    getTopRatedMovies(),
    getTopRatedTV(),
    getPopularTV(),
    getMoviesByGenre(GENRE.ACTION),
    getMoviesByGenre(GENRE.SCIFI),
    getTVByGenre(GENRE.CRIME),
    getMoviesByGenre(GENRE.HORROR),
    getMoviesByGenre(GENRE.COMEDY),
    getTVByGenre(GENRE.ANIMATION),
  ])

  const heroMovie = trendingAll.results.find(m => m.backdrop_path && m.overview) ?? trendingAll.results[0]

  return (
    <div className="bg-[#0a051b]">
      <Hero movie={heroMovie} />

      {/* Rows start here — slight overlap with hero bottom */}
      <div className="relative z-10 -mt-[10vw] space-y-6 pb-16">
        <MovieRow title="Trending Now" movies={trendingAll.results} defaultType="movie" showRanks />
        <MovieRow title="Now Playing in Theatres" movies={nowPlaying.results} defaultType="movie" />
        <MovieRow title="Popular TV Shows" movies={popularTV.results} defaultType="tv" />
        <MovieRow title="Top Rated Movies" movies={topMovies.results} defaultType="movie" />
        <MovieRow title="Action & Adventure" movies={actionMovies.results} defaultType="movie" />
        <MovieRow title="Top Rated TV" movies={topTV.results} defaultType="tv" showRanks />
        <MovieRow title="Sci-Fi & Fantasy" movies={scifiMovies.results} defaultType="movie" />
        <MovieRow title="Crime & Thriller Series" movies={crimeTV.results} defaultType="tv" />
        <MovieRow title="Horror Movies" movies={horrorMovies.results} defaultType="movie" />
        <MovieRow title="Comedies" movies={comedies.results} defaultType="movie" />
        <MovieRow title="Trending Movies This Week" movies={trendingMovies.results} defaultType="movie" />
        <MovieRow title="Anime & Animation" movies={animeTV.results} defaultType="tv" />
      </div>
    </div>
  )
}
