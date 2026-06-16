import type { VideoSource } from './types'

export const VIDEO_SOURCES: VideoSource[] = [
  {
    id: 'vidsrc-to',
    name: 'VidSrc.to',
    getUrl: (id, season, episode) =>
      season && episode
        ? `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`
        : `https://vidsrc.to/embed/movie/${id}`,
  },
  {
    id: 'vidsrc-me',
    name: 'VidSrc.me',
    getUrl: (id, season, episode) =>
      season && episode
        ? `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`
        : `https://vidsrc.me/embed/movie?tmdb=${id}`,
  },
  {
    id: '2embed',
    name: '2Embed',
    getUrl: (id, season, episode) =>
      season && episode
        ? `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`
        : `https://www.2embed.cc/embed/${id}`,
  },
  {
    id: 'smashystream',
    name: 'SmashyStream',
    getUrl: (id, season, episode) =>
      season && episode
        ? `https://player.smashy.stream/tv/${id}?s=${season}&e=${episode}`
        : `https://player.smashy.stream/movie/${id}`,
  },
]
