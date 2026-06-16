'use client'

import { useState } from 'react'
import { ChevronDown, RefreshCw, AlertTriangle } from 'lucide-react'
import { VIDEO_SOURCES } from '@/lib/videoSources'

interface Episode {
  episode_number: number
  name: string
  overview: string
  still_path: string | null
  runtime: number | null
}

interface Season {
  season_number: number
  name: string
  episode_count: number
  episodes?: Episode[]
}

interface VideoPlayerProps {
  tmdbId: number
  mediaType: 'movie' | 'tv'
  seasons?: Season[]
}

export default function VideoPlayer({ tmdbId, mediaType, seasons = [] }: VideoPlayerProps) {
  const [sourceIdx, setSourceIdx] = useState(0)
  const [season, setSeason] = useState(1)
  const [episode, setEpisode] = useState(1)
  const [iframeKey, setIframeKey] = useState(0)
  const [showSources, setShowSources] = useState(false)

  const activeSource = VIDEO_SOURCES[sourceIdx]

  const iframeSrc = activeSource.getUrl(
    tmdbId,
    mediaType === 'tv' ? season : undefined,
    mediaType === 'tv' ? episode : undefined
  )

  const reload = () => setIframeKey(k => k + 1)

  const switchSource = (i: number) => {
    setSourceIdx(i)
    setIframeKey(k => k + 1)
    setShowSources(false)
  }

  const pickEpisode = (s: number, e: number) => {
    setSeason(s)
    setEpisode(e)
    setIframeKey(k => k + 1)
  }

  // Real seasons from TMDB (filter out specials season 0)
  const realSeasons = seasons.filter(s => s.season_number > 0)
  const currentSeason = realSeasons.find(s => s.season_number === season) ?? realSeasons[0]
  const episodeCount = currentSeason?.episode_count ?? 20

  return (
    <div className="w-full">
      {/* ── Player toolbar ── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#181828] border border-white/10 rounded-t-xl gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyber-accent animate-pulse" />
          <span className="text-xs text-gray-400">Now Streaming</span>
          {mediaType === 'tv' && (
            <span className="text-xs text-cyber-accentLight font-semibold">
              S{season} · E{episode}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={reload}
            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title="Reload">
            <RefreshCw size={13} />
          </button>

          {/* Source selector */}
          <div className="relative">
            <button onClick={() => setShowSources(s => !s)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyber-accent/20 hover:bg-cyber-accent/30 border border-cyber-accent/40 rounded text-cyber-accentLight text-xs font-medium transition-colors">
              {activeSource.name}
              <ChevronDown size={11} className={`transition-transform ${showSources ? 'rotate-180' : ''}`} />
            </button>
            {showSources && (
              <div className="absolute right-0 top-full mt-1 bg-[#0a051b] border border-white/10 rounded-lg overflow-hidden shadow-2xl z-50 w-44">
                {VIDEO_SOURCES.map((src, i) => (
                  <button key={src.id} onClick={() => switchSource(i)}
                    className={`w-full px-3 py-2.5 text-left text-xs font-medium transition-colors flex items-center justify-between ${
                      i === sourceIdx ? 'bg-cyber-accent/20 text-cyber-accentLight' : 'text-gray-300 hover:bg-white/5'
                    }`}>
                    <span>{src.name}</span>
                    {i === 0 && <span className="text-[9px] text-cyber-accent font-bold">PRIMARY</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── iframe — full 16:9 ── */}
      <div className="relative w-full bg-black" style={{ paddingTop: '56.25%' }}>
        <iframe
          key={iframeKey}
          src={iframeSrc}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          referrerPolicy="origin"
          title="Video Player"
        />
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 px-4 py-2.5 bg-[#181828] border border-white/10 border-t-0 rounded-b-xl">
        <AlertTriangle size={12} className="text-yellow-600/60 shrink-0 mt-0.5" />
        <p className="text-[11px] text-gray-700">
          Embedded from third-party sources. If playback fails, switch source above.
        </p>
      </div>

      {/* ── Episode browser (TV only) ── */}
      {mediaType === 'tv' && realSeasons.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Episodes</h3>
            {/* Season selector */}
            <div className="relative">
              <select
                value={season}
                onChange={e => { setSeason(Number(e.target.value)); setEpisode(1); setIframeKey(k => k + 1) }}
                className="appearance-none bg-[#181828] border border-white/20 text-white text-sm px-4 py-2 pr-8 rounded cursor-pointer outline-none hover:border-cyber-accent transition-colors"
              >
                {realSeasons.map(s => (
                  <option key={s.season_number} value={s.season_number}>
                    Season {s.season_number}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Episode grid */}
          <div className="space-y-2">
            {Array.from({ length: episodeCount }, (_, i) => i + 1).map(ep => (
              <button
                key={ep}
                onClick={() => pickEpisode(season, ep)}
                className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors text-left group ${
                  ep === episode && season === season
                    ? 'bg-white/10 border border-cyber-accent/40'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                {/* Episode number */}
                <span className={`text-2xl font-bold w-8 shrink-0 text-center ${
                  ep === episode ? 'text-white' : 'text-gray-600'
                }`}>
                  {ep}
                </span>

                {/* Thumbnail placeholder */}
                <div className="w-32 aspect-video bg-gray-800 rounded overflow-hidden shrink-0 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      ep === episode
                        ? 'bg-cyber-accent text-white'
                        : 'bg-white/10 text-gray-500 group-hover:bg-white/20 group-hover:text-white'
                    }`}>
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">Episode {ep}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Season {season}</p>
                </div>

                {ep === episode && (
                  <span className="text-xs text-cyber-accent font-semibold shrink-0">▶ Playing</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
