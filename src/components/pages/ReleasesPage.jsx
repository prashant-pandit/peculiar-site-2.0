import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  ArrowUpDown,
  Check,
  Disc3,
  Download,
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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Tracks");
  const [sortBy, setSortBy] = useState("featured"); // 'featured' | 'bpm-asc' | 'bpm-desc' | 'latest'
  const [highlightedTrackId, setHighlightedTrackId] = useState(null);

  const { currentTrack, isPlaying, playTrack, openPurchaseModal } =
    useAudioPlayer();
  const trackRefs = useRef({});

  // Deep Link Instagram Handler
  useEffect(() => {
    if (deepLinkTrackId) {
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
    } else {
      window.scrollTo(0, 0);
    }
  }, [deepLinkTrackId]);

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

  const paymentStatus = searchParams.get("payment");
  const purchasedTrackId = searchParams.get("track");
  const purchasedTrack = purchasedTrackId
    ? musicTracks.find((t) => t.id.toLowerCase() === purchasedTrackId.toLowerCase())
    : null;

  return (
    <div className="min-h-screen pt-28 pb-36 px-margin-mobile md:px-margin-desktop text-on-surface">
      <div className="mx-auto max-w-container-max">
        {/* Payment Success Celebration Banner */}
        {paymentStatus === "success" && (
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-green-500/40 bg-green-950/30 p-5 backdrop-blur-md animate-fadeIn">
            <div className="flex items-center gap-3.5">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-black font-bold">
                <Check size={20} />
              </span>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-green-400">
                  Payment Confirmed • Master Audio Unlocked
                </div>
                <div className="text-sm font-medium text-white mt-0.5">
                  Thank you for supporting Peculiar Beats!{" "}
                  {purchasedTrack && (
                    <span>
                      Your download for <strong>{purchasedTrack.title}</strong> is ready.
                    </span>
                  )}
                </div>
              </div>
            </div>
            <a
              href={purchasedTrack?.downloadUrl && purchasedTrack.downloadUrl.startsWith("http") ? purchasedTrack.downloadUrl : "#"}
              onClick={(e) => {
                if (!purchasedTrack?.downloadUrl || !purchasedTrack.downloadUrl.startsWith("http")) {
                  e.preventDefault();
                  alert(`Downloading Lossless 24-bit WAV Master + 320kbps MP3 for ${purchasedTrack?.title || "Track"}!`);
                }
              }}
              className="flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 font-syne text-xs font-bold text-black hover:bg-green-400 transition-all whitespace-nowrap shadow-lg shadow-green-500/20"
            >
              <Download size={15} />
              <span>Download Master WAV</span>
            </a>
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
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-[#00ffff]/10 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-primary mb-4">
              <VinylMark /> Sonic Vault • Music Releases
            </div>
            <h1 className="font-syne text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              MASTER TRACKS & <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary via-[#ff00bf] to-[#00ffff] bg-clip-text text-transparent">
                EXCLUSIVE RELEASES
              </span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
              Listen to exclusive festival cuts, original club masters, and VIP
              dubplates. Download full 24-bit Lossless WAV + 320kbps MP3s with
              instant checkout.
            </p>

            {/* Feature Pills */}
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container px-3 py-1.5 border border-outline-variant/40 text-on-surface">
                <Check size={14} className="text-primary" /> Lossless 24-bit WAV
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container px-3 py-1.5 border border-outline-variant/40 text-on-surface">
                <Check size={14} className="text-primary" /> 320kbps High-Res MP3
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container px-3 py-1.5 border border-outline-variant/40 text-on-surface">
                <Check size={14} className="text-primary" /> DJ Club Extended Mixes
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container px-3 py-1.5 border border-outline-variant/40 text-on-surface">
                <Zap size={14} className="text-primary" /> Instant Delivery
              </span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
              />
              <input
                type="text"
                placeholder="Search by title, genre, BPM, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-outline-variant/40 bg-surface-container/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary backdrop-blur-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-on-surface-variant flex items-center gap-1 font-mono">
                <ArrowUpDown size={13} /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-outline-variant/40 bg-surface-container/80 px-3 py-2 text-xs text-white focus:border-primary focus:outline-none font-mono"
              >
                <option value="featured">Featured / Popular</option>
                <option value="latest">Latest Release</option>
                <option value="bpm-asc">BPM: Low to High</option>
                <option value="bpm-desc">BPM: High to Low</option>
              </select>
            </div>
          </div>

          {/* Genre Filter Pills - Clean, sleek styling without muddy box-shadow */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {trackGenres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  selectedGenre === genre
                    ? "bg-primary text-black font-bold border border-primary scale-[1.02]"
                    : "border border-outline-variant/30 bg-surface-container/50 text-on-surface-variant hover:border-primary/50 hover:text-white"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Tracks Bento Grid */}
        {filteredTracks.length === 0 ? (
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container/40 p-12 text-center">
            <Music2 size={40} className="mx-auto text-on-surface-variant/40 mb-3" />
            <h3 className="font-syne text-lg font-bold text-white">
              No tracks found
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Try adjusting your search query or selecting another genre.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedGenre("All Tracks");
              }}
              className="btn-primary mt-4 text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTracks.map((track) => {
              const isCurrentPlaying =
                currentTrack?.id === track.id && isPlaying;
              const isCurrentSelected = currentTrack?.id === track.id;
              const isDeepLinked = highlightedTrackId === track.id;

              return (
                <div
                  key={track.id}
                  ref={(el) => (trackRefs.current[track.id] = el)}
                  className={`group relative flex flex-col justify-between rounded-2xl border bg-[#140b17]/90 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${
                    isDeepLinked
                      ? "border-primary ring-2 ring-primary/50"
                      : isCurrentSelected
                        ? "border-primary/80 ring-1 ring-primary/30"
                        : "border-outline-variant/30 hover:border-primary/60"
                  }`}
                >
                  {/* Card Top: Artwork + Play Overlay */}
                  <div>
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-outline-variant/30 group-hover:border-primary/40 transition-colors">
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
                        aria-label={isCurrentPlaying ? "Pause preview" : "Play preview"}
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
                      </div>

                      {/* Bottom Info on Artwork */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                        <span className="rounded bg-black/80 backdrop-blur-md px-2 py-0.5 text-[11px] font-mono font-medium text-white border border-white/10">
                          {track.bpm} BPM • {track.key}
                        </span>
                        {isCurrentPlaying && (
                          <div className="bg-black/80 backdrop-blur-md px-2 py-1 rounded flex items-center gap-1.5 border border-primary/30">
                            <span className="text-[10px] font-mono text-primary">
                              PLAYING
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
                          {track.price}
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
                          <Play size={14} /> Preview
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => openPurchaseModal(track)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-[#ff00bf] py-2.5 px-3 text-xs font-syne font-bold text-black hover:brightness-110 active:scale-[0.98] transition-all"
                    >
                      <Download size={14} /> Buy & Download
                    </button>
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
