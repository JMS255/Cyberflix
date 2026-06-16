import type { Movie, MovieDetail, TMDBResponse } from './types'

const BASE_URL = 'https://api.themoviedb.org/3'

export const IMAGE_BASE = 'https://image.tmdb.org/t/p'
export const POSTER_SM = `${IMAGE_BASE}/w342`
export const POSTER_MD = `${IMAGE_BASE}/w500`
export const BACKDROP_LG = `${IMAGE_BASE}/w1280`
export const BACKDROP_ORIG = `${IMAGE_BASE}/original`

async function fetchTMDB<T>(
  endpoint: string,
  params: Record<string, string> = {},
  cacheSeconds = 3600
): Promise<T> {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY
  if (!apiKey) throw new Error('NEXT_PUBLIC_TMDB_API_KEY is not set')

  const url = new URL(`${BASE_URL}${endpoint}`)
  url.searchParams.set('api_key', apiKey)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString(), {
    next: { revalidate: cacheSeconds },
  })

  if (!res.ok) {
    throw new Error(`TMDB ${endpoint} → ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<T>
}

export const getTrending = (type: 'movie' | 'tv' | 'all' = 'all', window: 'day' | 'week' = 'week') =>
  fetchTMDB<TMDBResponse<Movie>>(`/trending/${type}/${window}`)

export const getNowPlaying = () =>
  fetchTMDB<TMDBResponse<Movie>>('/movie/now_playing')

export const getTopRatedMovies = () =>
  fetchTMDB<TMDBResponse<Movie>>('/movie/top_rated')

export const getTopRatedTV = () =>
  fetchTMDB<TMDBResponse<Movie>>('/tv/top_rated')

export const getPopularTV = () =>
  fetchTMDB<TMDBResponse<Movie>>('/tv/popular')

export const getMoviesByGenre = (genreId: number) =>
  fetchTMDB<TMDBResponse<Movie>>('/discover/movie', {
    with_genres: String(genreId),
    sort_by: 'popularity.desc',
  })

export const getTVByGenre = (genreId: number) =>
  fetchTMDB<TMDBResponse<Movie>>('/discover/tv', {
    with_genres: String(genreId),
    sort_by: 'popularity.desc',
  })

export const getMovieDetails = (id: number) =>
  fetchTMDB<MovieDetail>(`/movie/${id}`)

export const getTVDetails = (id: number) =>
  fetchTMDB<MovieDetail>(`/tv/${id}`)

export const searchMulti = (query: string) =>
  fetchTMDB<TMDBResponse<Movie>>('/search/multi', { query }, 60)
