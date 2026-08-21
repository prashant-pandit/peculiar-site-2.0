import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  CheckCircle,
  Download,
  Loader2,
  Lock,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useAudioPlayer } from "../../hooks";
import { EqualizerBars } from "../ui";

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function PersistentAudioPlayer() {
  const location = useLocation();
  const isReleasesPage =
    location.pathname === "/releases" ||
    location.pathname.startsWith("/releases/") ||
    location.pathname.startsWith("/musictrack");

  const {
    currentTrack,
    currentPlaylist,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    progress,
    volume,
    isMuted,
    previewLimitSeconds,
    isPlaylistUnlocked,
    togglePlay,
    pauseTrack,
    seek,
    setVolume,
    toggleMute,
    playNext,
    playPrev,
    getCurrentTrackIndex,
    openPurchaseModal,
  } = useAudioPlayer();

  const [isHoveringProgress, setIsHoveringProgress] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const progressBarRef = useRef(null);

  // Automatically pause playback if the user navigates away from the releases page
  useEffect(() => {
    if (!isReleasesPage && isPlaying) {
      pauseTrack();
    }
  }, [isReleasesPage, isPlaying, pauseTrack]);

  // Only render on the /releases page
  if (!isReleasesPage || !currentTrack) return null;

  const isUnlocked = currentPlaylist ? isPlaylistUnlocked(currentPlaylist.id) : false;
  const trackIndex = getCurrentTrackIndex();
  const totalTracks = currentPlaylist?.tracks?.length || 0;

  const handleProgressBarClick = (e) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    seek(fraction);
  };

  const handleProgressBarMouseMove = (e) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const moveX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, moveX / rect.width));
    setHoverPosition(fraction);
  };

  const effectiveDuration = duration || currentTrack.durationSec || 0;
  const previewFraction =
    effectiveDuration > 0
      ? Math.min(1, previewLimitSeconds / effectiveDuration) * 100
      : 100;
  const isHoverPastLimit =
    !isUnlocked && effectiveDuration > 0 && hoverPosition * effectiveDuration > previewLimitSeconds;

  const handleDownloadMaster = () => {
    // Open purchase modal on success step to show download links
    if (currentPlaylist) {
      openPurchaseModal(currentPlaylist, { showDownloads: true });
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${
        isMinimized ? "translate-y-[calc(100%-10px)] hover:translate-y-0" : "translate-y-0"
      }`}
    >
      {/* Player Frame with Glassmorphism */}
      <div className="relative border-t border-primary/20 bg-[#120a1a]/95 backdrop-blur-2xl px-4 py-3 md:px-8 text-on-surface shadow-[0_-10px_35px_-5px_rgba(0,0,0,0.8)]">
        {/* Top Interactive Progress Scrubber Bar */}
        <div
          ref={progressBarRef}
          className="absolute -top-1.5 left-0 right-0 h-3 cursor-pointer group flex items-center"
          onClick={handleProgressBarClick}
          onMouseEnter={() => setIsHoveringProgress(true)}
          onMouseLeave={() => setIsHoveringProgress(false)}
          onMouseMove={handleProgressBarMouseMove}
        >
          {/* Background rail */}
          <div className="w-full h-1 bg-white/15 relative transition-all group-hover:h-2">
            {/* 45s Preview Limit marker on the bar (only shown if not unlocked) */}
            {!isUnlocked && previewFraction < 100 && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-primary/80 z-10"
                style={{ left: `${previewFraction}%` }}
                title="45s Preview Limit"
              />
            )}

            {/* Progress fill */}
            <div
              className={`h-full relative ${
                isUnlocked
                  ? "bg-gradient-to-r from-green-400 to-primary"
                  : "bg-gradient-to-r from-primary to-[#ff00bf]"
              }`}
              style={{ width: `${progress}%` }}
            >
              {/* Scrubber handle */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_10px_#bf00ff] opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-1/2" />
            </div>
          </div>

          {/* Hover preview tooltip */}
          {isHoveringProgress && effectiveDuration > 0 && (
            <div
              className={`absolute -top-7 text-[10px] font-mono px-2 py-0.5 rounded border pointer-events-none transform -translate-x-1/2 shadow-lg flex items-center gap-1 ${
                isHoverPastLimit
                  ? "bg-red-950/90 text-red-300 border-red-500/40"
                  : "bg-black/90 text-primary border-primary/30"
              }`}
              style={{ left: `${hoverPosition * 100}%` }}
            >
              {isHoverPastLimit && <Lock size={10} />}
              <span>
                {formatTime(hoverPosition * effectiveDuration)}
                {isHoverPastLimit ? " (Locked)" : isUnlocked ? " (Full Master)" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Player Layout */}
        <div className="mx-auto flex max-w-container-max items-center justify-between gap-3 md:gap-6">
          {/* Track Info (Left) */}
          <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-initial md:w-80">
            <div className="relative h-12 w-12 md:h-14 md:w-14 rounded-lg overflow-hidden flex-shrink-0 border border-outline-variant/30 group">
              <img
                src={currentPlaylist?.coverArt || currentTrack.coverArt}
                alt={currentTrack.title}
                className="h-full w-full object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <EqualizerBars />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-syne text-sm md:text-base font-bold text-white truncate">
                  {currentTrack.title}
                </h4>
                {isUnlocked ? (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded border border-green-500/30">
                    <CheckCircle size={10} /> Unlocked
                  </span>
                ) : (
                  currentPlaylist?.isExclusive && (
                    <span className="hidden sm:inline-block text-[9px] font-bold uppercase tracking-wider bg-primary/20 text-primary px-1.5 py-0.5 rounded border border-primary/30">
                      Exclusive
                    </span>
                  )
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <span className="truncate">{currentPlaylist?.title || currentTrack.artist}</span>
                {totalTracks > 1 && (
                  <span className="text-[10px] font-mono text-primary/80 hidden sm:inline">
                    • Track {trackIndex}/{totalTracks}
                  </span>
                )}
                <span className="text-[10px] font-mono text-on-surface-variant/80 hidden sm:inline">
                  • {currentTrack.bpm} BPM
                </span>
                <span className="text-[10px] font-mono text-on-surface-variant/80 hidden lg:inline">
                  • {currentTrack.key}
                </span>
              </div>
            </div>
          </div>

          {/* Controls & Time (Center) */}
          <div className="flex flex-col items-center gap-1 flex-1 max-w-md">
            <div className="flex items-center gap-3 md:gap-5">
              {/* Prev */}
              <button
                onClick={playPrev}
                className="p-1.5 text-on-surface-variant hover:text-white transition-colors"
                aria-label="Previous track"
              >
                <SkipBack size={18} />
              </button>

              {/* Play / Pause Main CTA */}
              <button
                onClick={togglePlay}
                disabled={isLoading}
                className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-gradient-to-r from-[#bf00ff] to-[#ecb1ff] text-black transition-all hover:scale-105 active:scale-95 hover:brightness-110 disabled:opacity-75"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin text-black" />
                ) : isPlaying ? (
                  <Pause size={20} className="fill-black" />
                ) : (
                  <Play size={20} className="fill-black translate-x-0.5" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={playNext}
                className="p-1.5 text-on-surface-variant hover:text-white transition-colors"
                aria-label="Next track"
              >
                <SkipForward size={18} />
              </button>
            </div>

            {/* Time Indicator */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-on-surface-variant">
              <span className="text-white font-medium">{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(effectiveDuration)}</span>
              {isUnlocked ? (
                <span className="text-[10px] text-green-400 font-semibold bg-green-950/40 px-1.5 py-0.2 rounded border border-green-500/30">
                  Full Master
                </span>
              ) : (
                <span className="text-[10px] text-primary/90 font-semibold bg-primary/10 px-1.5 py-0.2 rounded border border-primary/20">
                  45s Preview
                </span>
              )}
            </div>
          </div>

          {/* Actions & Download (Right) */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            {/* Volume Slider (Desktop) */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-1.5 text-on-surface-variant hover:text-white transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={18} className="text-red-400" />
                ) : (
                  <Volume2 size={18} />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
                aria-label="Volume slider"
              />
            </div>

            {/* Buy OR Direct Download Button */}
            {isUnlocked ? (
              <button
                onClick={handleDownloadMaster}
                className="flex items-center gap-1.5 md:gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 px-3.5 py-2.5 md:px-5 md:py-2.5 font-syne text-xs md:text-sm font-bold text-black transition-all hover:scale-105 active:scale-95 hover:brightness-110 shadow-lg shadow-green-500/20"
              >
                <Download size={15} />
                <span>Download WAV</span>
              </button>
            ) : (
              <button
                onClick={() => openPurchaseModal(currentPlaylist)}
                className="flex items-center gap-1.5 md:gap-2 rounded-xl bg-gradient-to-r from-primary to-[#ff00bf] px-3.5 py-2.5 md:px-5 md:py-2.5 font-syne text-xs md:text-sm font-bold text-black transition-all hover:scale-105 active:scale-95 hover:brightness-110"
              >
                <Download size={15} />
                <span className="hidden xs:inline">Get Playlist</span>
                <span>({currentPlaylist?.priceInr || "₹399"})</span>
              </button>
            )}

            {/* Minimize toggle */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="hidden md:flex p-1.5 text-on-surface-variant hover:text-white rounded transition-colors"
              title={isMinimized ? "Expand Player" : "Minimize Player"}
              aria-label={isMinimized ? "Expand player" : "Minimize player"}
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
