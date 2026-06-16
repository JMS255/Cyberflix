export interface Movie {
  id: number
  title: string
  name?: string
  original_title?: string
  original_name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  release_date?: string
  first_air_date?: string
  genre_ids: number[]
  media_type?: 'movie' | 'tv' | 'person'
  popularity: number
}

export interface MovieDetail {
  id: number
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  release_date?: string
  first_air_date?: string
  runtime?: number
  episode_run_time?: number[]
  genres: Genre[]
  status: string
  tagline?: string
  number_of_seasons?: number
  number_of_episodes?: number
  production_companies: ProductionCompany[]
  spoken_languages: { english_name: string; iso_639_1: string }[]
}

export interface Genre {
  id: number
  name: string
}

export interface ProductionCompany {
  id: number
  name: string
  logo_path: string | null
}

export interface TMDBResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface VideoSource {
  id: string
  name: string
  getUrl: (id: number, season?: number, episode?: number) => string
}

export type MediaType = 'movie' | 'tv'
