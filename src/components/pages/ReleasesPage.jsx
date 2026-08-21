import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowUpDown,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Disc3,
  Download,
  Filter,
  Flame,
  Gift,
  Loader2,
  Music2,
  Pause,
  Play,
  Search,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react";
import { musicPlaylists, playlistGenres } from "../../constants";
import { useAudioPlayer } from "../../hooks";
import { generateDownloadLinks } from "../../utils";
import { EqualizerBars, VinylMark } from "../ui";

export default function ReleasesPage() {
  const [searchParams] = useSearchParams();
  const deepLinkTrackId = searchParams.get("track");
  const paymentStatus = searchParams.get("payment");
  const purchasedPlaylistId = searchParams.get("playlist");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Playlists");
  const [sortBy, setSortBy] = useState("featured"); // 'featured' | 'bpm-asc' | 'bpm-desc' | 'latest'
  const [highlightedPlaylistId, setHighlightedPlaylistId] = useState(null);
  const [expandedPlaylistId, setExpandedPlaylistId] = useState(null);

  // Download state for post-purchase
  const [downloadLinks, setDownloadLinks] = useState({});
  const [downloadLoading, setDownloadLoading] = useState({});

  const {
    currentTrack,
    currentPlaylist,
    isPlaying,
    isPlaylistUnlocked,
    unlockPlaylist,
    playTrack,
    openPurchaseModal,
    getPaymentId,
  } = useAudioPlayer();

  const playlistRefs = useRef({});

  // Deep Link Handler
  useEffect(() => {
    if (deepLinkTrackId && paymentStatus !== "success") {
      // Find the playlist containing this track
      const matched = musicPlaylists.find((p) =>
        p.tracks.some((t) => t.id.toLowerCase() === deepLinkTrackId.toLowerCase())
      );
      if (matched) {
        const matchedTrack = matched.tracks.find(
          (t) => t.id.toLowerCase() === deepLinkTrackId.toLowerCase()
        );
        setHighlightedPlaylistId(matched.id);
        setExpandedPlaylistId(matched.id);
        if (matchedTrack) playTrack(matchedTrack, matched);

        setTimeout(() => {
          const el = playlistRefs.current[matched.id];
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 300);
      }
    } else if (!deepLinkTrackId) {
      window.scrollTo(0, 0);
    }
  }, [deepLinkTrackId, paymentStatus]);

  // Payment Success Handler
  useEffect(() => {
    if (paymentStatus === "success" && purchasedPlaylistId) {
      unlockPlaylist(purchasedPlaylistId);
      const matched = musicPlaylists.find(
        (p) => p.id.toLowerCase() === purchasedPlaylistId.toLowerCase()
      );
      if (matched) {
        setExpandedPlaylistId(matched.id);
        // Play the first track of the purchased playlist
        if (matched.tracks.length > 0) {
          playTrack(matched.tracks[0], matched, true);
        }
        setTimeout(() => {
          const el = playlistRefs.current[matched.id];
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 300);
      }
    }
  }, [paymentStatus, purchasedPlaylistId]);

  // Filter & Sort Playlists
  const filteredPlaylists = useMemo(() => {
    return musicPlaylists
      .filter((playlist) => {
        const matchesGenre =
          selectedGenre === "All Playlists" || playlist.genre === selectedGenre;
        const matchesSearch =
          playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          playlist.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          playlist.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          playlist.tracks.some(
            (t) =>
              t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.bpm.toString().includes(searchQuery)
          );
        return matchesGenre && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "latest")
          return new Date(b.releaseDate) - new Date(a.releaseDate);
        if (sortBy === "bpm-asc")
          return (a.tracks[0]?.bpm || 0) - (b.tracks[0]?.bpm || 0);
        if (sortBy === "bpm-desc")
          return (b.tracks[0]?.bpm || 0) - (a.tracks[0]?.bpm || 0);
        return 0;
      });
  }, [searchQuery, selectedGenre, sortBy]);

  const purchasedPlaylist = purchasedPlaylistId
    ? musicPlaylists.find((p) => p.id.toLowerCase() === purchasedPlaylistId.toLowerCase())
    : null;

  // Handle download for a playlist (generates expiring links)
  const handleDownloadPlaylist = async (playlist) => {
    const playlistId = playlist.id;
    setDownloadLoading((prev) => ({ ...prev, [playlistId]: true }));

    try {
      const paymentId = getPaymentId(playlistId);
      const links = await generateDownloadLinks({
        playlistId,
        paymentId,
      });
      setDownloadLinks((prev) => ({ ...prev, [playlistId]: links }));
    } catch (err) {
      console.error("Download link generation error:", err);
      alert("Failed to generate download links. Please try again.");
    } finally {
      setDownloadLoading((prev) => ({ ...prev, [playlistId]: false }));
    }
  };

  const handleDownloadTrack = (link) => {
    if (link.downloadUrl) {
      const a = document.createElement("a");
      a.href = link.downloadUrl;
      a.download = `${link.trackId}-master.wav`;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
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
                  Payment Confirmed • Full Playlist Unlocked
                </div>
                <div className="text-sm font-medium text-white mt-0.5">
                  Thank you for supporting Peculiar Beats!{" "}
                  {purchasedPlaylist && (
                    <span>
                      <strong>{purchasedPlaylist.title}</strong> — {purchasedPlaylist.tracks.length} tracks unlocked.
                    </span>
                  )}
                </div>
              </div>
            </div>
            {purchasedPlaylist && (
              <button
                onClick={() => handleDownloadPlaylist(purchasedPlaylist)}
                disabled={downloadLoading[purchasedPlaylist.id]}
                className="flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 font-syne text-xs font-bold text-black hover:bg-green-400 transition-all whitespace-nowrap shadow-lg shadow-green-500/20 active:scale-95 disabled:opacity-75"
              >
                {downloadLoading[purchasedPlaylist.id] ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Generating Links...</span>
                  </>
                ) : (
                  <>
                    <Download size={15} />
                    <span>Download All Tracks</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Download Links Panel (appears after clicking download) */}
        {purchasedPlaylist && downloadLinks[purchasedPlaylist.id] && (
          <div className="mb-8 rounded-2xl border border-green-500/20 bg-surface-container/30 p-5 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Download size={16} className="text-green-400" />
                <span className="text-sm font-bold text-white">Download Links</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-yellow-300/80">
                <Timer size={12} />
                <span>Links expire in ~1 hour</span>
              </div>
            </div>
            <div className="space-y-2">
              {downloadLinks[purchasedPlaylist.id].map((link) => (
                <div
                  key={link.trackId}
                  className="flex items-center justify-between rounded-xl bg-surface-container/50 border border-outline-variant/20 px-4 py-2.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <Music2 size={14} className="text-primary/60 flex-shrink-0" />
                    <span className="text-xs font-semibold text-white truncate">{link.title}</span>
                  </div>
                  <button
                    onClick={() => handleDownloadTrack(link)}
                    className="flex items-center gap-1.5 text-xs font-bold text-green-400 hover:text-green-300 transition-colors flex-shrink-0 ml-3"
                  >
                    <Download size={13} />
                    <span>WAV</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deep Link Notification Banner */}
        {highlightedPlaylistId && !paymentStatus && (
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
                      musicPlaylists.find((p) => p.id === highlightedPlaylistId)
                        ?.title
                    }
                  </strong>
                </div>
              </div>
            </div>
            <button
              onClick={() => setHighlightedPlaylistId(null)}
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
              Explore official release playlists, VIP dubplates, and festival peak-time
              collections. Stream high-fidelity previews or purchase full playlist bundles with
              instant 24-bit master WAV delivery via UPI QR scan.
            </p>

            {/* Quick Stats Banner */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 pt-6 border-t border-outline-variant/20">
              <div>
                <div className="font-syne text-2xl font-bold text-white">
                  {musicPlaylists.length}
                </div>
                <div className="text-xs text-on-surface-variant font-mono">
                  Playlists
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
                  QR Scan
                </div>
                <div className="text-xs text-on-surface-variant font-mono">
                  UPI Payment
                </div>
              </div>
              <div>
                <div className="font-syne text-2xl font-bold text-primary">
                  Instant
                </div>
                <div className="text-xs text-on-surface-variant font-mono">
                  Secure Download
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Genre Pills */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {playlistGenres.map((genre) => (
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
                placeholder="Search playlists, tracks, BPM..."
                className="w-full rounded-xl border border-outline-variant/40 bg-surface-container/50 py-2 pl-9 pr-4 text-xs text-white placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort playlists by"
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

        {/* Playlist Grid */}
        {filteredPlaylists.length === 0 ? (
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container/20 p-12 text-center">
            <Music2 size={36} className="mx-auto text-on-surface-variant/50" />
            <h3 className="mt-3 font-syne text-lg font-bold text-white">
              No playlists found
            </h3>
            <p className="mt-1 text-xs text-on-surface-variant">
              Try adjusting your search query or selecting a different genre filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPlaylists.map((playlist) => {
              const isCurrentPlaylist = currentPlaylist?.id === playlist.id;
              const isCurrentPlaying = isCurrentPlaylist && isPlaying;
              const isHighlighted = highlightedPlaylistId === playlist.id;
              const isUnlocked = isPlaylistUnlocked(playlist.id);
              const isExpanded = expandedPlaylistId === playlist.id;
              const isFree = playlist.isFree;
              const playlistDownloads = downloadLinks[playlist.id];

              return (
                <div
                  key={playlist.id}
                  ref={(el) => (playlistRefs.current[playlist.id] = el)}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-[#140c1a]/90 transition-all duration-300 hover:border-primary/60 hover:-translate-y-1 ${
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
                    <div className="relative aspect-square w-full overflow-hidden bg-surface-container">
                      <img
                        src={playlist.coverArt}
                        alt={playlist.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Play overlay — plays first track */}
                      <button
                        onClick={() => playTrack(playlist.tracks[0], playlist)}
                        className={`absolute inset-0 flex items-center justify-center transition-all ${
                          isCurrentPlaying
                            ? "bg-black/40 opacity-100"
                            : "bg-black/30 opacity-0 group-hover:opacity-100"
                        }`}
                        aria-label={isCurrentPlaying ? "Pause audio" : "Play playlist"}
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
                            <CheckCircle size={10} /> Unlocked
                          </span>
                        ) : isFree ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-black/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/40">
                            <Gift size={10} /> Free Download
                          </span>
                        ) : (
                          <>
                            {playlist.isExclusive && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-black/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/30">
                                <Sparkles size={10} /> Exclusive
                              </span>
                            )}
                            {playlist.isPopular && (
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
                          {playlist.tracks.length} Tracks
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

                    {/* Metadata */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-[11px] font-mono uppercase tracking-wider text-primary">
                            {playlist.genre}
                          </div>
                          <h3 className="font-syne text-lg font-bold text-white group-hover:text-primary transition-colors">
                            {playlist.title}
                          </h3>
                        </div>
                        <span className={`font-syne text-base font-bold flex-shrink-0 ${isFree ? "text-emerald-400" : "text-white"}`}>
                          {isFree ? "Free" : playlist.priceInr || playlist.price}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-on-surface-variant line-clamp-2">
                        {playlist.description}
                      </p>

                      {/* Tags */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {playlist.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-surface-container/60 px-2 py-0.5 text-[10px] font-mono text-on-surface-variant border border-outline-variant/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Expandable Track List */}
                      <button
                        onClick={() => setExpandedPlaylistId(isExpanded ? null : playlist.id)}
                        className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-primary/80 hover:text-primary transition-colors"
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        {isExpanded ? "Hide Tracklist" : `View ${playlist.tracks.length} Tracks`}
                      </button>

                      {isExpanded && (
                        <div className="mt-3 rounded-xl border border-outline-variant/15 bg-surface-container/20 divide-y divide-outline-variant/10 animate-fadeIn">
                          {playlist.tracks.map((track, idx) => {
                            const isTrackPlaying = currentTrack?.id === track.id && isPlaying;

                            return (
                              <button
                                key={track.id}
                                onClick={() => playTrack(track, playlist)}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-white/5 transition-colors"
                              >
                                <span className="text-[10px] font-mono text-on-surface-variant w-4 text-center flex-shrink-0">
                                  {isTrackPlaying ? (
                                    <EqualizerBars />
                                  ) : (
                                    idx + 1
                                  )}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className={`text-xs font-semibold truncate ${isTrackPlaying ? "text-primary" : "text-white"}`}>
                                    {track.title}
                                  </div>
                                  <div className="text-[10px] text-on-surface-variant truncate">
                                    {track.bpm} BPM • {track.key} • {track.duration}
                                  </div>
                                </div>
                                {isTrackPlaying ? (
                                  <Pause size={12} className="text-primary flex-shrink-0" />
                                ) : (
                                  <Play size={12} className="text-on-surface-variant/50 flex-shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Download links panel (shown after generating) */}
                      {playlistDownloads && isExpanded && (
                        <div className="mt-3 rounded-xl border border-green-500/20 bg-green-950/10 p-3 animate-fadeIn">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Download size={12} className="text-green-400" />
                            <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Download Links</span>
                            <span className="text-[9px] text-yellow-300/60 ml-auto flex items-center gap-0.5">
                              <Timer size={10} /> Expires in ~1hr
                            </span>
                          </div>
                          {playlistDownloads.map((link) => (
                            <button
                              key={link.trackId}
                              onClick={() => handleDownloadTrack(link)}
                              className="w-full flex items-center justify-between px-2 py-1.5 text-xs text-white hover:text-green-400 transition-colors"
                            >
                              <span className="truncate">{link.title}</span>
                              <Download size={12} className="flex-shrink-0 ml-2" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom CTA Actions */}
                  <div className="px-4 pb-4 pt-0">
                    <div className="pt-4 border-t border-outline-variant/20 flex items-center gap-2">
                      <button
                        onClick={() => playTrack(playlist.tracks[0], playlist)}
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
                            <Play size={14} /> {isUnlocked ? "Play All" : "Preview"}
                          </>
                        )}
                      </button>

                      {isUnlocked || isFree ? (
                        <button
                          onClick={() => handleDownloadPlaylist(playlist)}
                          disabled={downloadLoading[playlist.id]}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 py-2.5 px-3 text-xs font-syne font-bold text-black hover:brightness-110 active:scale-[0.98] transition-all shadow-md shadow-green-500/20 disabled:opacity-75"
                        >
                          {downloadLoading[playlist.id] ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Download size={14} /> {isFree && !isUnlocked ? "Free Download" : "Download All"}
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => openPurchaseModal(playlist)}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-[#ff00bf] py-2.5 px-3 text-xs font-syne font-bold text-black hover:brightness-110 active:scale-[0.98] transition-all"
                        >
                          <Download size={14} /> Buy & Download
                        </button>
                      )}
                    </div>
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
