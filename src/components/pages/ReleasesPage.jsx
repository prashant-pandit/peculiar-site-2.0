import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowUpDown,
  Check,
  CheckCircle,
  Clock,
  Disc3,
  Download,
  Filter,
  Flame,
  Music2,
  Pause,
  Play,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { musicTracks, trackGenres } from "../../constants";
import { useAudioPlayer } from "../../hooks";
import { EqualizerBars, VinylMark } from "../ui";

export default function ReleasesPage() {
  const [searchParams] = useSearchParams();
  const deepLinkTrackId = searchParams.get("track");
  const paymentStatus = searchParams.get("payment");
  const purchasedTrackId = searchParams.get("track");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Tracks");
  const [sortBy, setSortBy] = useState("featured"); // 'featured' | 'bpm-asc' | 'bpm-desc' | 'latest'
  const [highlightedTrackId, setHighlightedTrackId] = useState(null);

  const {
    currentTrack,
    isPlaying,
    isTrackUnlocked,
    unlockTrack,
    playTrack,
    openPurchaseModal,
  } = useAudioPlayer();

  const trackRefs = useRef({});

  // Deep Link Instagram Handler
  useEffect(() => {
    if (deepLinkTrackId && paymentStatus !== "success") {
      const matched = musicTracks.find(
        (t) => t.id.toLowerCase() === deepLinkTrackId.toLowerCase(),
      );
      if (matched) {
        setHighlightedTrackId(matched.id);
        playTrack(matched);

        setTimeout(() => {
          const el = trackRefs.current[matched.id];
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 300);
      }
    } else if (!deepLinkTrackId) {
      window.scrollTo(0, 0);
    }
  }, [deepLinkTrackId, paymentStatus]);

  // Payment Success Handler: Unlock & Play Full Length Audio from Cloudflare R2
  useEffect(() => {
    if (paymentStatus === "success" && purchasedTrackId) {
      unlockTrack(purchasedTrackId);
      const matched = musicTracks.find(
        (t) => t.id.toLowerCase() === purchasedTrackId.toLowerCase(),
      );
      if (matched) {
        playTrack(matched, true);
        setTimeout(() => {
          const el = trackRefs.current[matched.id];
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 300);
      }
    }
  }, [paymentStatus, purchasedTrackId]);

  // Filter & Sort Tracks
  const filteredTracks = useMemo(() => {
    return musicTracks
      .filter((track) => {
        const matchesGenre =
          selectedGenre === "All Tracks" || track.genre === selectedGenre;
        const matchesSearch =
          track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ) ||
          track.bpm.toString().includes(searchQuery);
        return matchesGenre && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "bpm-asc") return a.bpm - b.bpm;
        if (sortBy === "bpm-desc") return b.bpm - a.bpm;
        if (sortBy === "latest")
          return new Date(b.releaseDate) - new Date(a.releaseDate);
        return 0;
      });
  }, [searchQuery, selectedGenre, sortBy]);

  const purchasedTrack = purchasedTrackId
    ? musicTracks.find((t) => t.id.toLowerCase() === purchasedTrackId.toLowerCase())
    : null;

  const handleDownloadTrack = (track) => {
    const downloadLink = track.downloadUrl || track.fullAudioUrl || track.previewUrl;
    if (downloadLink && downloadLink.startsWith("http")) {
      const a = document.createElement("a");
      a.href = downloadLink;
      a.download = `${track.id}-master.mp3`;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert(`Downloading Lossless 24-bit WAV Master + 320kbps MP3 for ${track.title}!`);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-36 px-margin-mobile md:px-margin-desktop text-on-surface">
      <div className="mx-auto max-w-container-max">
        {/* Payment Success Celebration Banner */}
        {paymentStatus === "success" && (
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-green-500/40 bg-green-950/30 p-5 backdrop-blur-md animate-fadeIn shadow-2xl">
            <div className="flex items-center gap-3.5">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-black font-bold">
                <Check size={20} />
              </span>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-green-400">
                  Payment Confirmed • Full Master Audio Unlocked
                </div>
                <div className="text-sm font-medium text-white mt-0.5">
                  Thank you for supporting Peculiar Beats!{" "}
                  {purchasedTrack && (
                    <span>
                      Now playing the uncut studio master for <strong>{purchasedTrack.title}</strong>.
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => purchasedTrack && handleDownloadTrack(purchasedTrack)}
              className="flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 font-syne text-xs font-bold text-black hover:bg-green-400 transition-all whitespace-nowrap shadow-lg shadow-green-500/20 active:scale-95"
            >
              <Download size={15} />
              <span>Download Master WAV</span>
            </button>
          </div>
        )}

        {/* Deep Link Notification Banner */}
        {highlightedTrackId && !paymentStatus && (
          <div className="mb-8 flex items-center justify-between rounded-xl border border-primary/40 bg-primary/10 p-4 backdrop-blur-md animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-black font-bold">
                <Sparkles size={16} />
              </span>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Instagram Link Detected
                </div>
                <div className="text-sm font-medium text-white">
                  Viewing & Playing:{" "}
                  <strong>
                    {
                      musicTracks.find((t) => t.id === highlightedTrackId)
                        ?.title
                    }
                  </strong>
                </div>
              </div>
            </div>
            <button
              onClick={() => setHighlightedTrackId(null)}
              className="text-xs text-on-surface-variant hover:text-white underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Hero Section */}
        <div className="relative mb-12 overflow-hidden rounded-3xl border border-outline-variant/30 bg-[#160d1c]/80 p-8 md:p-14 backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-[#ff00bf]/10 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
              <VinylMark className="w-3.5 h-3.5" />
              <span>Original Productions & Club Masters</span>
            </div>

            <h1 className="mt-4 font-syne text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Sonic Vault <span className="text-primary">•</span> Releases
            </h1>

            <p className="mt-4 text-sm text-on-surface-variant sm:text-base leading-relaxed">
              Explore official releases, VIP dubplates, and festival peak-time
              mixes. Listen to high-fidelity audio streams or purchase 24-bit
              studio master WAVs with instant delivery for your DJ sets.
            </p>

            {/* Quick Stats Banner */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 pt-6 border-t border-outline-variant/20">
              <div>
                <div className="font-syne text-2xl font-bold text-white">
                  {musicTracks.length}+
                </div>
                <div className="text-xs text-on-surface-variant font-mono">
                  Catalog Tracks
                </div>
              </div>
              <div>
                <div className="font-syne text-2xl font-bold text-primary">
                  24-bit
                </div>
                <div className="text-xs text-on-surface-variant font-mono">
                  Lossless WAV
                </div>
              </div>
              <div>
                <div className="font-syne text-2xl font-bold text-white">
                  100%
                </div>
                <div className="text-xs text-on-surface-variant font-mono">
                  Club Tested
                </div>
              </div>
              <div>
                <div className="font-syne text-2xl font-bold text-primary">
                  Instant
                </div>
                <div className="text-xs text-on-surface-variant font-mono">
                  Razorpay Checkout
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Genre Pills */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {trackGenres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  selectedGenre === genre
                    ? "bg-primary text-black"
                    : "border border-outline-variant/40 bg-surface-container/50 text-on-surface-variant hover:border-primary/50 hover:text-white"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, BPM, genre..."
                className="w-full rounded-xl border border-outline-variant/40 bg-surface-container/50 py-2 pl-9 pr-4 text-xs text-white placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort tracks by"
                className="appearance-none rounded-xl border border-outline-variant/40 bg-surface-container/50 py-2 pl-3 pr-8 text-xs font-semibold text-white focus:border-primary focus:outline-none"
              >
                <option value="featured" className="bg-[#140c1a]">
                  Featured
                </option>
                <option value="latest" className="bg-[#140c1a]">
                  Latest First
                </option>
                <option value="bpm-asc" className="bg-[#140c1a]">
                  BPM (Low to High)
                </option>
                <option value="bpm-desc" className="bg-[#140c1a]">
                  BPM (High to Low)
                </option>
              </select>
              <ArrowUpDown
                size={14}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
              />
            </div>
          </div>
        </div>

        {/* Track Grid */}
        {filteredTracks.length === 0 ? (
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container/20 p-12 text-center">
            <Music2 size={36} className="mx-auto text-on-surface-variant/50" />
            <h3 className="mt-3 font-syne text-lg font-bold text-white">
              No tracks found
            </h3>
            <p className="mt-1 text-xs text-on-surface-variant">
              Try adjusting your search query or selecting a different genre filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTracks.map((track) => {
              const isCurrentPlaying =
                currentTrack?.id === track.id && isPlaying;
              const isHighlighted = highlightedTrackId === track.id;
              const isUnlocked = isTrackUnlocked(track.id);

              return (
                <div
                  key={track.id}
                  ref={(el) => (trackRefs.current[track.id] = el)}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-[#140c1a]/90 p-4 transition-all duration-300 hover:border-primary/60 hover:-translate-y-1 ${
                    isHighlighted
                      ? "border-primary ring-2 ring-primary/50"
                      : "border-outline-variant/30"
                  }`}
                  style={{
                    boxShadow: isCurrentPlaying
                      ? "0 0 30px -10px rgba(191, 0, 255, 0.3)"
                      : "none",
                  }}
                >
                  {/* Artwork & Play overlay */}
                  <div>
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface-container">
                      <img
                        src={track.coverArt}
                        alt={track.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Play / Pause overlay trigger */}
                      <button
                        onClick={() => playTrack(track)}
                        className={`absolute inset-0 flex items-center justify-center transition-all ${
                          isCurrentPlaying
                            ? "bg-black/40 opacity-100"
                            : "bg-black/30 opacity-0 group-hover:opacity-100"
                        }`}
                        aria-label={isCurrentPlaying ? "Pause audio" : "Play audio"}
                      >
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-primary to-[#ff00bf] text-black transition-transform hover:scale-110">
                          {isCurrentPlaying ? (
                            <Pause size={22} className="fill-black" />
                          ) : (
                            <Play size={22} className="fill-black translate-x-0.5" />
                          )}
                        </span>
                      </button>

                      {/* Top badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        {isUnlocked ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-black/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-400 border border-green-500/40">
                            <CheckCircle size={10} /> Unlocked Master
                          </span>
                        ) : (
                          <>
                            {track.isExclusive && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-black/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/30">
                                <Sparkles size={10} /> Exclusive
                              </span>
                            )}
                            {track.isPopular && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-black/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#ffb960] border border-[#ffb960]/30">
                                <Flame size={10} /> Popular
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      {/* Bottom Info on Artwork */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                        <span className="rounded bg-black/80 backdrop-blur-md px-2 py-0.5 text-[11px] font-mono font-medium text-white border border-white/10">
                          {track.bpm} BPM • {track.key}
                        </span>
                        {isCurrentPlaying && (
                          <div className="bg-black/80 backdrop-blur-md px-2 py-1 rounded flex items-center gap-1.5 border border-primary/30">
                            <span className="text-[10px] font-mono text-primary">
                              {isUnlocked ? "FULL MASTER" : "PLAYING"}
                            </span>
                            <EqualizerBars />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metadata Details */}
                    <div className="mt-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-[11px] font-mono uppercase tracking-wider text-primary">
                            {track.genre}
                          </div>
                          <h3 className="font-syne text-lg font-bold text-white group-hover:text-primary transition-colors">
                            {track.title}
                          </h3>
                        </div>
                        <span className="font-syne text-base font-bold text-white flex-shrink-0">
                          {track.priceInr || track.price}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-on-surface-variant line-clamp-2">
                        {track.description}
                      </p>

                      {/* Tags */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {track.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-surface-container/60 px-2 py-0.5 text-[10px] font-mono text-on-surface-variant border border-outline-variant/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA Actions */}
                  <div className="mt-5 pt-4 border-t border-outline-variant/20 flex items-center gap-2">
                    <button
                      onClick={() => playTrack(track)}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-semibold transition-all ${
                        isCurrentPlaying
                          ? "bg-primary/20 text-primary border border-primary/40"
                          : "bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30"
                      }`}
                    >
                      {isCurrentPlaying ? (
                        <>
                          <Pause size={14} /> Playing
                        </>
                      ) : (
                        <>
                          <Play size={14} /> {isUnlocked ? "Play Master" : "Preview"}
                        </>
                      )}
                    </button>

                    {isUnlocked ? (
                      <button
                        onClick={() => handleDownloadTrack(track)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 py-2.5 px-3 text-xs font-syne font-bold text-black hover:brightness-110 active:scale-[0.98] transition-all shadow-md shadow-green-500/20"
                      >
                        <Download size={14} /> Download WAV
                      </button>
                    ) : (
                      <button
                        onClick={() => openPurchaseModal(track)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-[#ff00bf] py-2.5 px-3 text-xs font-syne font-bold text-black hover:brightness-110 active:scale-[0.98] transition-all"
                      >
                        <Download size={14} /> Buy & Download
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Custom Music / VIP Inquiries Bento */}
        <div className="mt-16 rounded-2xl border border-outline-variant/30 bg-[#170e1c] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="font-syne text-xl md:text-2xl font-bold text-white">
              Need Custom Edits, Dubplates, or Stems?
            </h3>
            <p className="mt-2 text-xs md:text-sm text-on-surface-variant">
              Get in touch for bespoke music production, exclusive DJ sets,
              stems, or licensing for commercial events and campaigns.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/peculiar_beats/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs md:text-sm whitespace-nowrap"
            >
              DM on Instagram
            </a>
            <Link to="/#booking" className="btn-primary text-xs md:text-sm whitespace-nowrap">
              Book for Event
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
