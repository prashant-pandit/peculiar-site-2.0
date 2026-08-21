import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { musicPlaylists, findPlaylistByTrackId } from "../constants";

const AudioPlayerContext = createContext(null);

export const PREVIEW_LIMIT_SECONDS = 45;
const STORAGE_KEY_UNLOCKED = "pb_unlocked_playlists";
const STORAGE_KEY_PAYMENTS = "pb_payment_ids";

export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(null);
  const currentTrackRef = useRef(null);
  const currentPlaylistRef = useRef(null);
  const hasTriggeredLimitRef = useRef(false);

  // Unlocked playlist IDs (persisted in localStorage)
  const [unlockedPlaylistIds, setUnlockedPlaylistIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_UNLOCKED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Payment IDs associated with unlocked playlists (for download link regeneration)
  const [paymentIds, setPaymentIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PAYMENTS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [purchasePlaylist, setPurchasePlaylist] = useState(null);
  const [purchaseModalMeta, setPurchaseModalMeta] = useState({});
  const [isPreviewGated, setIsPreviewGated] = useState(false);

  // Sync refs with state
  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  useEffect(() => {
    currentPlaylistRef.current = currentPlaylist;
  }, [currentPlaylist]);

  /**
   * Check if a playlist is unlocked (purchased or free)
   */
  const isPlaylistUnlocked = (playlistId) => {
    if (!playlistId) return false;
    // Free playlists are always unlocked
    const playlist = musicPlaylists.find((p) => p.id === playlistId);
    if (playlist?.isFree) return true;
    return unlockedPlaylistIds.includes(playlistId);
  };

  /**
   * Check if a specific track is unlocked (via its parent playlist)
   */
  const isTrackUnlocked = (trackId) => {
    if (!trackId) return false;
    const playlist = findPlaylistByTrackId(trackId);
    if (!playlist) return false;
    return isPlaylistUnlocked(playlist.id);
  };

  /**
   * Unlock a playlist after successful payment
   */
  const unlockPlaylist = (playlistId, paymentId = null) => {
    if (!playlistId) return;

    setUnlockedPlaylistIds((prev) => {
      if (prev.includes(playlistId)) return prev;
      const updated = [...prev, playlistId];
      try {
        localStorage.setItem(STORAGE_KEY_UNLOCKED, JSON.stringify(updated));
      } catch (err) {
        console.warn("Failed to persist unlocked playlists:", err);
      }
      return updated;
    });

    // Store payment ID for download link regeneration
    if (paymentId) {
      setPaymentIds((prev) => {
        const updated = { ...prev, [playlistId]: paymentId };
        try {
          localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(updated));
        } catch (err) {
          console.warn("Failed to persist payment IDs:", err);
        }
        return updated;
      });
    }

    // If currently playing a track from this playlist, switch to full audio
    if (currentTrackRef.current && currentPlaylistRef.current?.id === playlistId && audioRef.current) {
      const target = currentTrackRef.current;
      const fullUrl = target.fullAudioUrl || target.previewUrl;
      const savedTime = audioRef.current.currentTime;

      audioRef.current.src = fullUrl;
      audioRef.current.currentTime = savedTime;
      setIsPreviewGated(false);
      hasTriggeredLimitRef.current = false;
      audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => console.warn(err));
    }
  };

  /**
   * Get the stored payment ID for a playlist (for download regeneration)
   */
  const getPaymentId = (playlistId) => paymentIds[playlistId] || null;

  // Initialize native HTML5 Audio instance once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = 0.85;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      const current = audio.currentTime;
      setCurrentTime(current);

      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }

      // If track's parent playlist is unlocked, NO preview cutoff applies
      const track = currentTrackRef.current;
      const playlist = currentPlaylistRef.current;
      if (track && playlist && isPlaylistUnlocked(playlist.id)) {
        return;
      }

      // Check 45-Second Preview Gating Limit for unpurchased tracks
      if (current >= PREVIEW_LIMIT_SECONDS) {
        audio.pause();
        audio.currentTime = PREVIEW_LIMIT_SECONDS;
        setCurrentTime(PREVIEW_LIMIT_SECONDS);
        setIsPlaying(false);
        setIsPreviewGated(true);

        // Open modal ONLY ONCE when crossing the 45s threshold
        if (!hasTriggeredLimitRef.current) {
          hasTriggeredLimitRef.current = true;
          if (currentPlaylistRef.current) {
            setPurchasePlaylist(currentPlaylistRef.current);
            setPurchaseModalMeta({ isLimitReached: true });
          }
        }
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
      setIsLoading(false);
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handlePlaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      handleNext();
    };
    const handleError = (e) => {
      console.warn("Audio playback error:", e);
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audio.src = "";
    };
  }, [unlockedPlaylistIds]);

  /**
   * Play a specific track within a playlist context
   */
  const playTrack = (track, playlist = null, forceFull = false) => {
    if (!track) return;
    const audio = audioRef.current;
    if (!audio) return;

    // Resolve parent playlist if not provided
    const resolvedPlaylist = playlist || findPlaylistByTrackId(track.id);
    const isUnlocked = (resolvedPlaylist && isPlaylistUnlocked(resolvedPlaylist.id)) || forceFull;

    if (currentTrack?.id === track.id) {
      if (!isUnlocked && currentTime >= PREVIEW_LIMIT_SECONDS) {
        // Replay preview from start
        hasTriggeredLimitRef.current = false;
        setIsPreviewGated(false);
        audio.currentTime = 0;
        setCurrentTime(0);
        audio.play().then(() => setIsPlaying(true)).catch((err) => console.warn(err));
        return;
      }
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch((err) => console.warn("Audio autoplay blocked:", err));
      }
      return;
    }

    hasTriggeredLimitRef.current = false;
    setIsPreviewGated(false);
    setCurrentTrack(track);
    setCurrentPlaylist(resolvedPlaylist);
    setIsLoading(true);
    setCurrentTime(0);
    setDuration(track.durationSec || 0);

    // Fetch full length audio if unlocked, else preview
    const audioSource = isUnlocked
      ? track.fullAudioUrl || track.previewUrl
      : track.previewUrl;

    audio.src = audioSource;
    audio.load();
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.warn("Autoplay interaction required:", err);
        setIsPlaying(false);
      });
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const togglePlay = () => {
    if (!currentTrack) {
      // Play the first track of the first playlist
      if (musicPlaylists.length > 0 && musicPlaylists[0].tracks.length > 0) {
        playTrack(musicPlaylists[0].tracks[0], musicPlaylists[0]);
      }
      return;
    }

    const isUnlocked = currentPlaylist && isPlaylistUnlocked(currentPlaylist.id);

    if (!isUnlocked && currentTime >= PREVIEW_LIMIT_SECONDS) {
      openPurchaseModal(currentPlaylist, { isLimitReached: true });
      return;
    }

    if (isPlaying) {
      pauseTrack();
    } else if (audioRef.current) {
      audioRef.current.play().catch((err) => console.warn("Playback error:", err));
    }
  };

  const seek = (fraction) => {
    if (!audioRef.current || isNaN(fraction)) return;
    let targetTime = Math.max(0, Math.min(fraction * (duration || 1), duration));
    const isUnlocked = currentPlaylist && isPlaylistUnlocked(currentPlaylist.id);

    // Enforce 45s preview limit ceiling ONLY if playlist is NOT unlocked
    if (!isUnlocked && targetTime >= PREVIEW_LIMIT_SECONDS) {
      targetTime = PREVIEW_LIMIT_SECONDS;
      setIsPreviewGated(true);
      if (!hasTriggeredLimitRef.current) {
        hasTriggeredLimitRef.current = true;
        openPurchaseModal(currentPlaylist, { isLimitReached: true });
      }
    } else {
      setIsPreviewGated(false);
      hasTriggeredLimitRef.current = false;
    }

    audioRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const setVolume = (value) => {
    const vol = Math.max(0, Math.min(1, value));
    setVolumeState(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
    if (vol > 0 && isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.muted = false;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.muted = nextMuted;
  };

  /**
   * Navigate to the next track within the current playlist
   */
  const handleNext = () => {
    if (!currentTrack || !currentPlaylist) return;
    hasTriggeredLimitRef.current = false;
    setIsPreviewGated(false);

    const tracks = currentPlaylist.tracks;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    playTrack(tracks[nextIndex], currentPlaylist);
  };

  /**
   * Navigate to the previous track within the current playlist
   */
  const handlePrev = () => {
    if (!currentTrack || !currentPlaylist) return;
    if (currentTime > 3) {
      seek(0);
      return;
    }
    hasTriggeredLimitRef.current = false;
    setIsPreviewGated(false);

    const tracks = currentPlaylist.tracks;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    playTrack(tracks[prevIndex], currentPlaylist);
  };

  /**
   * Get current track index within the playlist (1-based)
   */
  const getCurrentTrackIndex = () => {
    if (!currentTrack || !currentPlaylist) return 0;
    return currentPlaylist.tracks.findIndex((t) => t.id === currentTrack.id) + 1;
  };

  const openPurchaseModal = (playlist, meta = {}) => {
    setPurchasePlaylist(playlist || currentPlaylist);
    setPurchaseModalMeta(meta);
  };

  const closePurchaseModal = () => {
    setPurchasePlaylist(null);
    setPurchaseModalMeta({});
  };

  const replayPreview = () => {
    if (!audioRef.current) return;
    hasTriggeredLimitRef.current = false;
    setIsPreviewGated(false);
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => console.warn(err));
    closePurchaseModal();
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        currentPlaylist,
        isPlaying,
        isLoading,
        currentTime,
        duration,
        progress,
        volume,
        isMuted,
        purchasePlaylist,
        purchaseModalMeta,
        isPreviewGated,
        previewLimitSeconds: PREVIEW_LIMIT_SECONDS,
        unlockedPlaylistIds,
        isPlaylistUnlocked,
        isTrackUnlocked,
        unlockPlaylist,
        getPaymentId,
        playTrack,
        pauseTrack,
        togglePlay,
        seek,
        setVolume,
        toggleMute,
        playNext: handleNext,
        playPrev: handlePrev,
        getCurrentTrackIndex,
        openPurchaseModal,
        closePurchaseModal,
        replayPreview,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
}
