'use client'

import { useState } from 'react'
import { ChevronDown, AlertTriangle, RefreshCw } from 'lucide-react'
import { VIDEO_SOURCES } from '@/lib/videoSources'

interface VideoPlayerProps {
  tmdbId: number
  mediaType: 'movie' | 'tv'
  season?: number
  episode?: number
}

export default function VideoPlayer({ tmdbId, mediaType, season = 1, episode = 1 }: VideoPlayerProps) {
  const [sourceIdx, setSourceIdx] = useState(0)
  const [currentSeason, setCurrentSeason] = useState(season)
  const [currentEpisode, setCurrentEpisode] = useState(episode)
  const [key, setKey] = useState(0)
  const [showSources, setShowSources] = useState(false)

  const activeSource = VIDEO_SOURCES[sourceIdx]
  const iframeSrc = activeSource.getUrl(
    tmdbId,
    mediaType === 'tv' ? currentSeason : undefined,
    mediaType === 'tv' ? currentEpisode : undefined
  )

  const reload = () => setKey(k => k + 1)

  const switchSource = (idx: number) => {
    setSourceIdx(idx)
    setKey(k => k + 1)
    setShowSources(false)
  }

  return (
    <div className="w-full bg-black rounded-2xl overflow-hidden border border-cyber-border shadow-2xl shadow-cyber-accent/10">
      {/* Player toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-cyber-card border-b border-cyber-border gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyber-accent animate-pulse" />
          <span className="text-xs text-gray-400 font-medium">Now Streaming</span>
        </div>

        {/* Episode picker (TV only) */}
        {mediaType === 'tv' && (
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <label className="flex items-center gap-1">
              <span className="text-gray-500">S</span>
              <input
                type="number"
                min={1}
                value={currentSeason}
                onChange={e => { setCurrentSeason(Number(e.target.value)); setKey(k => k + 1) }}
                className="w-10 bg-cyber-bg border border-cyber-border rounded px-1 py-0.5 text-center text-white outline-none focus:border-cyber-accent"
              />
            </label>
            <label className="flex items-center gap-1">
              <span className="text-gray-500">E</span>
              <input
                type="number"
                min={1}
                value={currentEpisode}
                onChange={e => { setCurrentEpisode(Number(e.target.value)); setKey(k => k + 1) }}
                className="w-10 bg-cyber-bg border border-cyber-border rounded px-1 py-0.5 text-center text-white outline-none focus:border-cyber-accent"
              />
            </label>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Reload */}
          <button
            onClick={reload}
            className="p-1.5 rounded-lg bg-cyber-bg hover:bg-cyber-cardHover border border-cyber-border text-gray-400 hover:text-cyber-accentLight transition-all"
            title="Reload player"
          >
            <RefreshCw size={14} />
          </button>

          {/* Source selector */}
          <div className="relative">
            <button
              onClick={() => setShowSources(s => !s)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyber-accent/20 hover:bg-cyber-accent/30 border border-cyber-accent/40 rounded-lg text-cyber-accentLight text-xs font-medium transition-all"
            >
              {activeSource.name}
              <ChevronDown size={12} className={`transition-transform ${showSources ? 'rotate-180' : ''}`} />
            </button>

            {showSources && (
              <div className="absolute right-0 top-full mt-1 bg-cyber-card border border-cyber-border rounded-xl overflow-hidden shadow-2xl shadow-black/60 z-50 w-40 animate-fadeIn">
                {VIDEO_SOURCES.map((src, i) => (
                  <button
                    key={src.id}
                    onClick={() => switchSource(i)}
                    className={`w-full px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                      i === sourceIdx
                        ? 'bg-cyber-accent/20 text-cyber-accentLight'
                        : 'text-gray-300 hover:bg-cyber-cardHover hover:text-white'
                    }`}
                  >
                    {i === sourceIdx && <span className="text-cyber-accent mr-1.5">▶</span>}
                    {src.name}
                    {i === 0 && <span className="ml-1 text-[9px] text-cyber-accent font-bold">PRIMARY</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* iFrame */}
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <iframe
          key={key}
          src={iframeSrc}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          referrerPolicy="origin"
          title="Video Player"
        />
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 px-4 py-3 bg-cyber-card/50 border-t border-cyber-border/50">
        <AlertTriangle size={13} className="text-yellow-500/70 shrink-0 mt-0.5" />
        <p className="text-[11px] text-gray-600 leading-relaxed">
          Video is embedded from third-party sources. If playback fails, switch to an alternative source above.
        </p>
      </div>
    </div>
  )
}
