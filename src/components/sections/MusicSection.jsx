import React, { useCallback, useEffect, useRef, useState } from "react";
import { youtubePlaylist } from "../../constants";
import "./MusicSection.css";

// Tracks come from the public Google Drive folders (Bolly-Dawn, Bolly-Dusk,
// Bolly-Dark). BPM and duration are unknown, so the UI shows placeholders.
const tracks = [
  {
    id: 1,
    title: "Gehra Hua x Isoma",
    subtitle: "Peculiar Beats · Bolly-Dawn Mashup Pack",
    genre: "Bolly-Dawn",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ff2e93 100%)",
    driveFileId: "1kX0hjsTBp2JpEP7-R0bnertwm7aIrFmL",
    fileName: "GEHRA HUA X ISOMA - PECULIAR BEATS.wav",
  },
  {
    id: 2,
    title: "Ijazat x Secret ID",
    subtitle: "Peculiar Beats · Bolly-Dawn Mashup Pack",
    genre: "Bolly-Dawn",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ff2e93 100%)",
    driveFileId: "1CgLsAarF5Qf0gAAkp9tpKNAluRbP2ZIl",
    fileName: "IJAZAT X SECRET ID - PECULIAR BEAT.wav",
  },
  {
    id: 3,
    title: "Illahi x The Nights",
    subtitle: "Peculiar Beats · Bolly-Dawn Mashup Pack",
    genre: "Bolly-Dawn",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ff2e93 100%)",
    driveFileId: "1MSG6XGmcWwKGNUpWI_gRkh3s0s5DP0wa",
    fileName: "ILLAHI X THE NIGHTS - PECULIAR BEATS.wav",
  },
  {
    id: 4,
    title: "Taal Se Taal (Banger Mix)",
    subtitle: "Peculiar Beats · Bolly-Dawn Mashup Pack",
    genre: "Bolly-Dawn",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ff2e93 100%)",
    driveFileId: "1TOXZIr3_4X8wIJFW96FQt_MF7H5VhM4G",
    fileName: "Taal se Taal ( BANGER MIX) - PECULIAR BEATS.wav",
  },
  {
    id: 5,
    title: "Woh Lamhe",
    subtitle: "Peculiar Beats · Bolly-Dawn Mashup Pack",
    genre: "Bolly-Dawn",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ff2e93 100%)",
    driveFileId: "12P3HX1Fsh7iOf_dV2LWmRCOqDHPuUCfE",
    fileName: "WOH LAMHE - PECULIAR BEATS.wav",
  },
  {
    id: 6,
    title: "Yeh Tune Kya Kiya (PVT Edit)",
    subtitle: "Peculiar Beats · Bolly-Dawn Mashup Pack",
    genre: "Bolly-Dawn",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ff2e93 100%)",
    driveFileId: "1LJi32AUuV6jnbkNWKzycozVToLg4oLer",
    fileName: "YEH TUNE KYA KIYA (PVT EDIT) - PECULIAR BEATS.wav",
  },
  {
    id: 7,
    title: "Aaj Ki Raat x Day N Night",
    subtitle: "Peculiar Beats · BOLLY-DUSK Mashups Pack",
    genre: "Bolly-Dusk",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #ff2e93 100%)",
    driveFileId: "1yEtz4NM5G6ebDVKbkbtKEsgGbalXbFCa",
    fileName: "Aaj Ki Raat X Day N Night - Peculiar Beats Mashup.wav",
  },
  {
    id: 8,
    title: "Kiya Kiya x Stay Sexy",
    subtitle: "Peculiar Beats · BOLLY-DUSK Mashups Pack",
    genre: "Bolly-Dusk",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #ff2e93 100%)",
    driveFileId: "1hD0ReQSmk0_AhUb-P-zzKEzgtdq61kL_",
    fileName: "Kiya Kiya X Stay Sexy (Peculiar).wav",
  },
  {
    id: 9,
    title: "Mundiyan Tu Bachke x Caramelle",
    subtitle: "Peculiar Beats · BOLLY-DUSK Mashups Pack",
    genre: "Bolly-Dusk",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #ff2e93 100%)",
    driveFileId: "1AyoXfNPdEmmg7gANR9zZzXzBnt2S_9hL",
    fileName: "Mundiyan Tu Bachke X Caramelle - Peculiar Beats Mashup.wav",
  },
  {
    id: 10,
    title: "O Mere Khuda x Chanti",
    subtitle: "Peculiar Beats · BOLLY-DUSK Mashups Pack",
    genre: "Bolly-Dusk",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #ff2e93 100%)",
    driveFileId: "1GWaVjLyt1YuohOJKqbHk38i9zOVOf713",
    fileName: "O Mere Khuda X Chanti - Peculiar Beats Mashup.mp3",
  },
  {
    id: 11,
    title: "Vaari Jaavan x Jija",
    subtitle: "Peculiar Beats · BOLLY-DUSK Mashups Pack",
    genre: "Bolly-Dusk",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #ff2e93 100%)",
    driveFileId: "11K9sRmNDL5IHzOOWMUp96ftHAYeo-q0Q",
    fileName: "Vaari Jaavan x JIJA - Peculiar Beats Mashup.wav",
  },
  {
    id: 12,
    title: "Chunnari Chunnari x Tik Tok",
    subtitle: "Peculiar Beats · BOLLY-DARK",
    genre: "Bolly-Dark",
    gradient: "linear-gradient(135deg, #38bdf8 0%, #7c3aed 100%)",
    driveFileId: "1guutXXlrvIPrEL2wRLNrvUfBvQ2LoCjh",
    fileName: "Chunnari Chunnari X Tik Tok - PECULIAR BEATS Mashup.wav",
  },
  {
    id: 13,
    title: "Fandry x Vegas 98",
    subtitle: "Peculiar Beats · BOLLY-DARK",
    genre: "Bolly-Dark",
    gradient: "linear-gradient(135deg, #38bdf8 0%, #7c3aed 100%)",
    driveFileId: "1esx6IaA49z8eY-1cSDd0MLpUReLvkar0",
    fileName: "FANDRY x VEGAS 98 - PECULIAR BEATS Mashup.wav",
  },
  {
    id: 14,
    title: "Jo Tere Sang x Papito",
    subtitle: "Peculiar Beats · BOLLY-DARK",
    genre: "Bolly-Dark",
    gradient: "linear-gradient(135deg, #38bdf8 0%, #7c3aed 100%)",
    driveFileId: "1aBEe3KnNMs5OimAVIasoGUkKoxBJz2ci",
    fileName: "Jo Tere Sang X Papito - PECULIAR BEATS Mashup.wav",
  },
  {
    id: 15,
    title: "Ramta Jogi x Mustafa",
    subtitle: "Peculiar Beats · BOLLY-DARK",
    genre: "Bolly-Dark",
    gradient: "linear-gradient(135deg, #38bdf8 0%, #7c3aed 100%)",
    driveFileId: "1uQdPYe-kQKaf5eG8rDz-Z8QMCmpMgv9n",
    fileName: "Ramta Jogi X Mustafa - PECULIAR BEATS MASHUP.wav",
  },
  {
    id: 16,
    title: "Tere Pyaar Main x Unique Moment",
    subtitle: "Peculiar Beats · BOLLY-DARK",
    genre: "Bolly-Dark",
    gradient: "linear-gradient(135deg, #38bdf8 0%, #7c3aed 100%)",
    driveFileId: "1EECG38NRn9skUNz78iRbWw1j2FF4Hr8H",
    fileName: "Tere Pyaar Main X Unique Moment - PECULIAR BEATS Mashup.wav",
  },
];

const genres = ["All", ...new Set(tracks.map((t) => t.genre))];

const waveHeights = [
  28, 45, 62, 38, 84, 96, 54, 70, 88, 42, 60, 92, 76, 48, 66, 98, 72, 52, 85,
  64, 40, 78, 94, 58, 46, 82, 68, 50, 90, 74, 44, 62, 86, 56, 70, 95, 60, 42,
  76, 54, 38, 64, 48, 30,
];

// Google blocks cross-site fetch()/<audio> requests to its plain download
// endpoint (403), so streaming and tracked downloads use the official Drive API,
// which needs VITE_GOOGLE_DRIVE_API_KEY (files shared as "Anyone with the link").
const DRIVE_API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;

const driveApiUrl = (track) =>
  `https://www.googleapis.com/drive/v3/files/${track.driveFileId}?alt=media&key=${DRIVE_API_KEY}`;

// Without an API key, fall back to a navigation-style download through a
// hidden iframe. It works, but the page can't tell when it finishes.
const driveDirectUrl = (track) =>
  `https://drive.usercontent.google.com/download?id=${track.driveFileId}&export=download&confirm=t`;

const formatOf = (track) => track.fileName.split(".").pop().toUpperCase();

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function DownloadIcon({ size = 13, strokeWidth = 2.2 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function PlayPauseIcon({ playing, size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      {playing ? (
        <>
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </>
      ) : (
        <polygon points="6 4 20 12 6 20 6 4" />
      )}
    </svg>
  );
}

export default function MusicSection() {
  const [activeTrackId, setActiveTrackId] = useState(1);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const audioRef = useRef(null);
  // trackId -> "downloading" | "done"
  const [downloadState, setDownloadState] = useState({});
  const [toast, setToast] = useState({ show: false, text: "" });
  const toastTimer = useRef(null);

  const activeIndex = Math.max(
    0,
    tracks.findIndex((t) => t.id === activeTrackId),
  );
  const activeTrack = tracks[activeIndex];
  const visibleTracks =
    activeFilter === "All"
      ? tracks
      : tracks.filter((t) => t.genre === activeFilter);

  const showToast = useCallback((text) => {
    setToast({ show: true, text });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, show: false })),
      2800,
    );
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const selectTrack = useCallback((index) => {
    setActiveTrackId(tracks[index].id);
    setElapsedSec(0);
    setDurationSec(0);
    setIsPlaying(true);
  }, []);

  // Keep the <audio> element in sync with the play/pause state and track.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying && !DRIVE_API_KEY) {
      setIsPlaying(false);
      showToast("Streaming needs VITE_GOOGLE_DRIVE_API_KEY");
    } else if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
        showToast("Unable to play this track");
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, activeTrackId, showToast]);

  const handleScrub = (e) => {
    if (!durationSec) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * durationSec;
    setElapsedSec(ratio * durationSec);
  };

  const handleRowClick = (track) => {
    if (track.id === activeTrackId) {
      setIsPlaying((p) => !p);
    } else {
      selectTrack(tracks.findIndex((t) => t.id === track.id));
    }
  };

  // Fetches the file from Google Drive in the background (no navigation) and
  // saves it through a temporary blob link once finished.
  const downloadTrack = async (track) => {
    if (downloadState[track.id] === "downloading") return;

    if (!DRIVE_API_KEY) {
      const frame = document.createElement("iframe");
      frame.style.display = "none";
      frame.src = driveDirectUrl(track);
      document.body.appendChild(frame);
      setTimeout(() => frame.remove(), 120000);
      showToast("Download started. Check your browser downloads");
      return;
    }

    setDownloadState((s) => ({ ...s, [track.id]: "downloading" }));
    showToast(`Downloading "${track.title}"...`);

    try {
      const response = await fetch(driveApiUrl(track));
      if (!response.ok) throw new Error(`Drive responded ${response.status}`);

      const blobUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = track.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

      setDownloadState((s) => ({ ...s, [track.id]: "done" }));
      showToast("Download done");
    } catch {
      setDownloadState((s) => {
        const { [track.id]: _removed, ...rest } = s;
        return rest;
      });
      showToast("Download failed. Please try again");
    }
  };

  const progress = durationSec ? Math.min(1, elapsedSec / durationSec) : 0;
  const playedBars = Math.round(progress * waveHeights.length);
  const activeDownload = downloadState[activeTrack.id];

  const deckLabel =
    activeDownload === "downloading"
      ? "Downloading..."
      : activeDownload === "done"
        ? "Download done"
        : "Download Track";

  return (
    <section className="music-section" id="music-releases">
      <div className="mu-section-header">
        <div className="mu-title-group">
          <div className="mu-title-row">
            <span className="mu-title-icon" aria-hidden="true">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
            <h2 className="mu-section-title">Music Releases</h2>
          </div>
          <p className="mu-section-subtitle">
            Browse the playlist, stream each track directly, and download
            high-quality DJ edits.
          </p>
        </div>

        <div className="mu-header-actions">
          <div
            className="mu-filter-pills"
            role="tablist"
            aria-label="Filter releases by genre"
          >
            {genres.map((genre) => (
              <button
                key={genre}
                type="button"
                className={`mu-filter-pill ${activeFilter === genre ? "active" : ""}`}
                onClick={() => setActiveFilter(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
          <a
            className="mu-open-playlist-btn"
            href={youtubePlaylist.url}
            target="_blank"
            rel="noreferrer"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            OPEN PLAYLIST
          </a>
        </div>
      </div>

      <audio
        ref={audioRef}
        key={activeTrack.id}
        src={DRIVE_API_KEY ? driveApiUrl(activeTrack) : undefined}
        preload="metadata"
        onLoadedMetadata={(e) => setDurationSec(e.currentTarget.duration)}
        onTimeUpdate={(e) => setElapsedSec(e.currentTarget.currentTime)}
        onEnded={() => selectTrack((activeIndex + 1) % tracks.length)}
        onError={() => {
          setIsPlaying(false);
          showToast("Unable to load this track");
        }}
      />

      <div className={`mu-now-playing-card ${isPlaying ? "is-playing" : ""}`}>
        <div className="mu-deck-left">
          <div
            className="mu-deck-cover"
            style={{ background: activeTrack.gradient }}
          >
            <div className="mu-deck-cover-vinyl" />
          </div>
          <div className="mu-deck-meta">
            <span className="mu-deck-eyebrow">
              <span className="mu-eq-bars" aria-hidden="true">
                <span className="mu-eq-bar" />
                <span className="mu-eq-bar" />
                <span className="mu-eq-bar" />
              </span>
              <span>{isPlaying ? "NOW PLAYING" : "READY TO PLAY"}</span>
            </span>
            <div className="mu-deck-title">{activeTrack.title}</div>
            <div className="mu-deck-sub">
              {`${activeTrack.subtitle} · ${formatOf(activeTrack)}`}
            </div>
          </div>
        </div>

        <div className="mu-deck-center">
          <div className="mu-transport-row">
            <button
              className="mu-icon-btn"
              type="button"
              aria-label="Previous track"
              onClick={() =>
                selectTrack((activeIndex - 1 + tracks.length) % tracks.length)
              }
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="19 20 9 12 19 4 19 20" />
                <line x1="5" y1="19" x2="5" y2="5" />
              </svg>
            </button>
            <button
              className="mu-play-main-btn"
              type="button"
              aria-label="Play or pause"
              onClick={() => setIsPlaying((p) => !p)}
            >
              <PlayPauseIcon playing={isPlaying} size={18} />
            </button>
            <button
              className="mu-icon-btn"
              type="button"
              aria-label="Next track"
              onClick={() => selectTrack((activeIndex + 1) % tracks.length)}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 4 15 12 5 20 5 4" />
                <line x1="19" y1="5" x2="19" y2="19" />
              </svg>
            </button>
          </div>

          <div className="mu-scrubber-row">
            <span className="mu-time-label">{formatTime(elapsedSec)}</span>
            <div
              className="mu-waveform-scrubber"
              aria-label="Track progress"
              onClick={handleScrub}
            >
              {waveHeights.map((h, i) => (
                <span
                  key={i}
                  className={`mu-wave-bar ${i < playedBars ? "played" : ""}`}
                  style={{ height: `${Math.round((h / 100) * 26)}px` }}
                />
              ))}
            </div>
            <span className="mu-time-label end">
              {durationSec ? formatTime(durationSec) : "--:--"}
            </span>
          </div>
        </div>

        <div className="mu-deck-right">
          <button
            className={`mu-download-primary-btn ${activeDownload === "done" ? "saved" : ""}`}
            type="button"
            disabled={activeDownload === "downloading"}
            onClick={() => downloadTrack(activeTrack)}
          >
            <DownloadIcon size={15} />
            <span>{deckLabel}</span>
          </button>
        </div>
      </div>

      <div className="mu-playlist-list">
        {visibleTracks.map((track, idx) => {
          const isCurrent = track.id === activeTrackId;
          const state = downloadState[track.id];
          return (
            <div
              key={track.id}
              className={`mu-track-row ${isCurrent ? "active" : ""}`}
              onClick={() => handleRowClick(track)}
            >
              <div className="mu-track-index">
                {isCurrent ? (
                  <span className="mu-track-play-badge">
                    <PlayPauseIcon playing={isPlaying} size={11} />
                  </span>
                ) : (
                  <span>{String(idx + 1).padStart(2, "0")}</span>
                )}
              </div>
              <div
                className="mu-track-art"
                style={{ background: track.gradient }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,0.85)"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="2.5" />
                </svg>
              </div>
              <div className="mu-track-info">
                <div className="mu-track-name">{track.title}</div>
                <div className="mu-track-mix">{track.subtitle}</div>
              </div>
              <span className="mu-genre-tag">{track.genre}</span>
              <span className="mu-track-bpm">{formatOf(track)}</span>
              <span className="mu-track-duration">
                {isCurrent && durationSec ? formatTime(durationSec) : "—"}
              </span>
              <button
                className={`mu-row-download-btn ${state === "done" ? "downloaded" : ""}`}
                type="button"
                disabled={state === "downloading"}
                onClick={(e) => {
                  e.stopPropagation();
                  downloadTrack(track);
                }}
              >
                {state === "done" ? (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <DownloadIcon />
                )}
                <span>
                  {state === "downloading"
                    ? "Downloading..."
                    : state === "done"
                      ? "Download done"
                      : "Download"}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <div className={`mu-toast ${toast.show ? "show" : ""}`} role="status">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>{toast.text}</span>
      </div>
    </section>
  );
}
