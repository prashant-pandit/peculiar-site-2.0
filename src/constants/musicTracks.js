/**
 * Music Playlist Catalog for Peculiar Beats (Sonic Vanguard)
 * Hosted on Cloudflare R2:
 * - Preview clips (45s gating before purchase per track)
 * - Full Uncut Master Audio (streamable & downloadable after playlist purchase)
 *
 * Data Model: Playlists → Tracks hierarchy
 * Some playlists are free (isFree: true), others require purchase.
 */

export const R2_BASE = "https://pub-f1a3f69c340e4dec8fda3b8eb74ce3ce.r2.dev";

export const musicPlaylists = [
  {
    id: "neon-pulse-ep",
    title: "Neon Pulse EP",
    subtitle: "Festival Peak Time Collection",
    artist: "Peculiar Beats",
    genre: "Peak Time Techno",
    releaseDate: "2026-02-14",
    coverArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    description: "Driving underground techno with hypnotic modular synth leads, massive sub pressure, and electrifying drops built for stadium sound systems.",
    tags: ["Festival Ready", "Heavy Bass", "24-bit WAV Included"],
    isExclusive: true,
    isPopular: true,
    isFree: false,
    price: "$4.99",
    priceInr: "₹399",
    priceInPaise: 39900,
    tracks: [
      {
        id: "neon-pulse",
        title: "Neon Pulse",
        subtitle: "Festival Peak Time Mix",
        bpm: 130,
        key: "Fm",
        duration: "4:12",
        durationSec: 252,
        previewUrl: `${R2_BASE}/previews/soundhelix_preview.mp3`,
        fullAudioUrl: `${R2_BASE}/artwork/SoundHelix.mp3`,
        masterKey: "masters/neon-pulse-master.wav",
      },
      {
        id: "neon-pulse-vip",
        title: "Neon Pulse (VIP Mix)",
        subtitle: "Extended Club Edit",
        bpm: 132,
        key: "Fm",
        duration: "5:30",
        durationSec: 330,
        previewUrl: `${R2_BASE}/previews/soundhelix_preview.mp3`,
        fullAudioUrl: `${R2_BASE}/artwork/SoundHelix.mp3`,
        masterKey: "masters/neon-pulse-vip-master.wav",
      },
    ],
  },
  {
    id: "delhi-nights-pack",
    title: "Delhi Nights Pack",
    subtitle: "Club Edit & Extended Collection",
    artist: "Peculiar Beats",
    genre: "Afro & Tech House",
    releaseDate: "2026-02-01",
    coverArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    description: "Deep tribal grooves fused with rolling tech-house basslines and atmospheric late-night textures, tested in club sets across 20+ cities.",
    tags: ["Afro Tech", "Groovy Percussion", "Club Favorite"],
    isExclusive: false,
    isPopular: true,
    isFree: false,
    price: "$4.99",
    priceInr: "₹399",
    priceInPaise: 39900,
    tracks: [
      {
        id: "delhi-after-dark",
        title: "Delhi After Dark",
        subtitle: "Club Edit & Extended Intro",
        bpm: 126,
        key: "Am",
        duration: "5:08",
        durationSec: 308,
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        fullAudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        masterKey: "masters/delhi-after-dark-master.wav",
      },
      {
        id: "delhi-sunrise",
        title: "Delhi Sunrise",
        subtitle: "After Hours Mix",
        bpm: 124,
        key: "Cm",
        duration: "4:45",
        durationSec: 285,
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        fullAudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        masterKey: "masters/delhi-sunrise-master.wav",
      },
    ],
  },
  {
    id: "cyber-odyssey-ep",
    title: "Cyber Odyssey EP",
    subtitle: "Melodic Techno Journey",
    artist: "Peculiar Beats",
    genre: "Melodic Techno",
    releaseDate: "2026-01-20",
    coverArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    description: "An emotional, futuristic journey featuring lush analog arp sequences, towering builds, and an uplifting breakdown that ignites sunset sessions.",
    tags: ["Melodic", "Euphoric Lead", "Mastered for Big Systems"],
    isExclusive: true,
    isPopular: false,
    isFree: false,
    price: "$5.99",
    priceInr: "₹449",
    priceInPaise: 44900,
    tracks: [
      {
        id: "cyber-odyssey",
        title: "Cyber Odyssey",
        subtitle: "Original Club Mix",
        bpm: 128,
        key: "G#m",
        duration: "4:45",
        durationSec: 285,
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        fullAudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        masterKey: "masters/cyber-odyssey-master.wav",
      },
      {
        id: "cyber-odyssey-dub",
        title: "Cyber Odyssey (Dub Mix)",
        subtitle: "Stripped-Back Dub",
        bpm: 128,
        key: "G#m",
        duration: "4:20",
        durationSec: 260,
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        fullAudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        masterKey: "masters/cyber-odyssey-dub-master.wav",
      },
    ],
  },
  {
    id: "bass-weapons-vol1",
    title: "Bass Weapons Vol. 1",
    subtitle: "VIP Dubplate Collection",
    artist: "Peculiar Beats",
    genre: "Bass & UK Garage",
    releaseDate: "2026-01-08",
    coverArt: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80",
    description: "Raw syncopated percussion, 2-step swing, and speaker-rattling sub frequency designed for bass lovers and underground warehouse raves.",
    tags: ["UK Garage", "Heavy Wobble", "Dubplate"],
    isExclusive: false,
    isPopular: false,
    isFree: false,
    price: "$4.99",
    priceInr: "₹399",
    priceInPaise: 39900,
    tracks: [
      {
        id: "sub-zero-bass",
        title: "Sub Zero Bass",
        subtitle: "VIP Dubplate",
        bpm: 134,
        key: "Dm",
        duration: "3:54",
        durationSec: 234,
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        fullAudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        masterKey: "masters/sub-zero-bass-master.wav",
      },
      {
        id: "warehouse-riddim",
        title: "Warehouse Riddim",
        subtitle: "140 BPM Dubplate",
        bpm: 140,
        key: "Gm",
        duration: "3:32",
        durationSec: 212,
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        fullAudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        masterKey: "masters/warehouse-riddim-master.wav",
      },
    ],
  },
  {
    id: "bollywood-fusion-pack",
    title: "Bollywood Fusion Pack",
    subtitle: "Festival Mashup Collection",
    artist: "Peculiar Beats",
    genre: "Bollywood Fusion",
    releaseDate: "2025-12-28",
    coverArt: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80",
    description: "High-octane commercial fusion blending iconic desi hooks with modern punchy electronic basslines. A proven crowd pleaser across 600+ gigs.",
    tags: ["Crowd Pleaser", "Wedding & Club Anthem", "High Energy"],
    isExclusive: true,
    isPopular: true,
    isFree: false,
    price: "$3.99",
    priceInr: "₹299",
    priceInPaise: 29900,
    tracks: [
      {
        id: "bollywood-frequencies",
        title: "Bollywood Frequencies",
        subtitle: "Festival Mashup / Re-Drum",
        bpm: 128,
        key: "Cm",
        duration: "4:30",
        durationSec: 270,
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        fullAudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        masterKey: "masters/bollywood-frequencies-master.wav",
      },
      {
        id: "desi-drop",
        title: "Desi Drop",
        subtitle: "Club Banger Edit",
        bpm: 130,
        key: "Am",
        duration: "3:45",
        durationSec: 225,
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        fullAudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        masterKey: "masters/desi-drop-master.wav",
      },
    ],
  },
  {
    id: "free-sampler-pack",
    title: "Free Sampler Pack",
    subtitle: "Taste of Peculiar Beats",
    artist: "Peculiar Beats",
    genre: "Deep Progressive",
    releaseDate: "2025-12-15",
    coverArt: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
    description: "Hypnotic pads, organic world percussion, and a warm bassline that captures the golden hour vibe. Free download — no purchase required.",
    tags: ["Free Download", "Sunset Vibes", "Lush Atmosphere"],
    isExclusive: false,
    isPopular: false,
    isFree: true,
    price: "Free",
    priceInr: "Free",
    priceInPaise: 0,
    tracks: [
      {
        id: "aurora-drift",
        title: "Aurora Drift",
        subtitle: "Sunset Chillout Mix",
        bpm: 122,
        key: "Em",
        duration: "5:22",
        durationSec: 322,
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        fullAudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        masterKey: "masters/aurora-drift-master.wav",
      },
      {
        id: "midnight-glow",
        title: "Midnight Glow",
        subtitle: "Deep Progressive Original",
        bpm: 120,
        key: "Dm",
        duration: "4:50",
        durationSec: 290,
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
        fullAudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
        masterKey: "masters/midnight-glow-master.wav",
      },
    ],
  },
];

/**
 * Helper: Flatten all tracks across all playlists (for search, global navigation, etc.)
 * Each returned track includes a reference to its parent playlist.
 */
export function getAllTracks() {
  const allTracks = [];
  for (const playlist of musicPlaylists) {
    for (const track of playlist.tracks) {
      allTracks.push({
        ...track,
        playlistId: playlist.id,
        playlistTitle: playlist.title,
        genre: playlist.genre,
        coverArt: playlist.coverArt,
        artist: playlist.artist,
      });
    }
  }
  return allTracks;
}

/**
 * Helper: Find the parent playlist for a given track ID
 */
export function findPlaylistByTrackId(trackId) {
  return musicPlaylists.find((p) => p.tracks.some((t) => t.id === trackId)) || null;
}

/**
 * Helper: Find a playlist by its ID
 */
export function findPlaylistById(playlistId) {
  return musicPlaylists.find((p) => p.id === playlistId) || null;
}

export const playlistGenres = [
  "All Playlists",
  "Peak Time Techno",
  "Afro & Tech House",
  "Melodic Techno",
  "Bass & UK Garage",
  "Bollywood Fusion",
  "Deep Progressive",
];
