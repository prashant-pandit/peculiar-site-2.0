import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { musicTracks } from "../constants";

const AudioPlayerContext = createContext(null);

export const PREVIEW_LIMIT_SECONDS = 45;
const STORAGE_KEY_UNLOCKED = "pb_unlocked_tracks";

export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(null);
  const currentTrackRef = useRef(null);
  const hasTriggeredLimitRef = useRef(false);

  const [unlockedTrackIds, setUnlockedTrackIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_UNLOCKED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseTrack, setPurchaseTrack] = useState(null);
  const [purchaseModalMeta, setPurchaseModalMeta] = useState({});
  const [isPreviewGated, setIsPreviewGated] = useState(false);

  // Sync ref with state
  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  const isTrackUnlocked = (trackId) => {
    if (!trackId) return false;
    return unlockedTrackIds.includes(trackId);
  };

  const unlockTrack = (trackId) => {
    if (!trackId) return;
    setUnlockedTrackIds((prev) => {
      if (prev.includes(trackId)) return prev;
      const updated = [...prev, trackId];
      try {
        localStorage.setItem(STORAGE_KEY_UNLOCKED, JSON.stringify(updated));
      } catch (err) {
        console.warn("Failed to persist unlocked tracks in localStorage:", err);
      }
      return updated;
    });

    // If the currently playing track is the one unlocked, switch to full audio stream
    if (currentTrackRef.current?.id === trackId && audioRef.current) {
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

      // If track is unlocked/purchased, NO preview cutoff applies (plays full length!)
      const track = currentTrackRef.current;
      if (track && unlockedTrackIds.includes(track.id)) {
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
          if (currentTrackRef.current) {
            setPurchaseTrack(currentTrackRef.current);
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
  }, [unlockedTrackIds]);

  const playTrack = (track, forceFull = false) => {
    if (!track) return;
    const audio = audioRef.current;
    if (!audio) return;

    const isUnlocked = isTrackUnlocked(track.id) || forceFull;

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
    setIsLoading(true);
    setCurrentTime(0);
    setDuration(track.durationSec || 0);

    // Fetch full length audio from Cloudflare R2 if unlocked, else preview
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
      if (musicTracks.length > 0) {
        playTrack(musicTracks[0]);
      }
      return;
    }

    const isUnlocked = isTrackUnlocked(currentTrack.id);

    if (!isUnlocked && currentTime >= PREVIEW_LIMIT_SECONDS) {
      openPurchaseModal(currentTrack, { isLimitReached: true });
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
    const isUnlocked = currentTrack && isTrackUnlocked(currentTrack.id);

    // Enforce 45s preview limit ceiling ONLY if track is NOT unlocked
    if (!isUnlocked && targetTime >= PREVIEW_LIMIT_SECONDS) {
      targetTime = PREVIEW_LIMIT_SECONDS;
      setIsPreviewGated(true);
      if (!hasTriggeredLimitRef.current) {
        hasTriggeredLimitRef.current = true;
        openPurchaseModal(currentTrack, { isLimitReached: true });
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

  const handleNext = () => {
    if (!currentTrack || musicTracks.length === 0) return;
    hasTriggeredLimitRef.current = false;
    setIsPreviewGated(false);
    const currentIndex = musicTracks.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % musicTracks.length;
    playTrack(musicTracks[nextIndex]);
  };

  const handlePrev = () => {
    if (!currentTrack || musicTracks.length === 0) return;
    if (currentTime > 3) {
      seek(0);
      return;
    }
    hasTriggeredLimitRef.current = false;
    setIsPreviewGated(false);
    const currentIndex = musicTracks.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + musicTracks.length) % musicTracks.length;
    playTrack(musicTracks[prevIndex]);
  };

  const openPurchaseModal = (track, meta = {}) => {
    setPurchaseTrack(track || currentTrack);
    setPurchaseModalMeta(meta);
  };

  const closePurchaseModal = () => {
    setPurchaseTrack(null);
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
        isPlaying,
        isLoading,
        currentTime,
        duration,
        progress,
        volume,
        isMuted,
        purchaseTrack,
        purchaseModalMeta,
        isPreviewGated,
        previewLimitSeconds: PREVIEW_LIMIT_SECONDS,
        unlockedTrackIds,
        isTrackUnlocked,
        unlockTrack,
        playTrack,
        pauseTrack,
        togglePlay,
        seek,
        setVolume,
        toggleMute,
        playNext: handleNext,
        playPrev: handlePrev,
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
