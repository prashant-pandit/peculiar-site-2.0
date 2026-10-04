# Project Brief: Peculiar Site 2.0 (Sonic Vanguard)

## 1. Project Overview & Vision
**Peculiar Site 2.0** is the official digital platform, artist portfolio, music release vault, and event booking concierge for **Peculiar Beats**—a high-energy electronic music producer and touring DJ with a performance footprint spanning 600+ events and 20+ cities.

The platform embodies the **"Sonic Vanguard"** design ethos: a fusion of dark minimalism, Swiss-inspired typographic precision, and high-contrast electric accents. Beyond a conventional portfolio, it operates as a specialized direct-to-consumer (D2C) music commerce hub and booking engine.

---

## 2. Target Audience
1. **Club & Festival Curators / Event Organizers**: Promoters, festival bookers, and nightlife venue managers seeking high-energy electronic, techno, and commercial festival sets.
2. **Corporate & Luxury Wedding Clients**: High-end event planners seeking tailored sonic curation, verified client credentials, and seamless booking inquiries.
3. **Electronic Music Fans & DJs**: Listeners, collectors, and fellow DJs exploring original productions, VIP dubplates, and purchasing uncompressed 24-bit Lossless WAV studio masters for live DJ performances.
4. **Social Traffic (Instagram / YouTube / SoundCloud)**: Followers arriving via targeted track deep-links (`/releases?track=<id>`) from social reels and festival recap videos.

---

## 3. Core Requirements & Key Features

### 🎵 Sonic Vault & Releases Catalog (`/releases`)
- Comprehensive music catalog categorized by genre (Peak Time Techno, Afro & Tech House, Melodic Techno, Bass & UK Garage, Bollywood Fusion, Deep Progressive).
- Real-time client-side search across titles, BPM, genres, and metadata tags.
- Multi-criteria sorting (Featured, Latest, BPM Ascending/Descending).
- Deep-link support with automated auto-play and smooth scroll targeting from Instagram/social campaigns.

### 🎧 Persistent Audio Streaming & 45-Second Preview Gating
- High-fidelity streaming powered by **Cloudflare R2 Object Storage** with zero egress fees and global CDN distribution.
- Persistent bottom audio player with custom waveform scrubbers, track details, time indicators, and responsive controls.
- **Audio Preview Gating Engine**: Unpurchased tracks enforce a strict 45-second preview ceiling, locking the scrubber and automatically triggering the purchase paywall upon reaching the limit.
- Route isolation: Audio playback and modal triggers are strictly scoped to the `/releases` route.

### 💳 Razorpay Direct-to-Consumer Checkout & Instant Fulfillment
- Standard Web Checkout modal supporting all major Indian payment rails (UPI, GPay, PhonePe, Paytm, QR scan, Cards, NetBanking) and international cards.
- Server-side cryptographic order creation (`/api/create-order`) and HMAC SHA-256 signature verification (`/api/verify-payment`).
- Seamless post-payment redirect flow unlocking full-length uncompressed master audio playback in-browser and providing instant 24-bit WAV / 320kbps MP3 download access.

### 📅 Booking Concierge & Automated Alerts
- Custom inquiry form capturing client name, event type, date, contact preferences (WhatsApp/Phone vs. Email), and project vision.
- Instant lead dispatch directly to management via the **Telegram Bot API**.
- Interactive UI features including custom date selectors, contact method toggles, and celebratory confetti bursts on successful submission.

### 📺 Media Showcase & YouTube Integration
- Video showcase featuring live festival and club set footage with custom thumbnail previews.
- Dynamic YouTube channel playlist fetching via YouTube Data API v3 with `postMessage` player state synchronization and live Equalizer bar animations.

---

## 4. Flagged for User Review (Business & Architectural Decisions)
> [!NOTE]
> **Master Audio Distribution**: Master audio files (24-bit WAVs) are currently served via direct Cloudflare R2 links upon verified client-side unlock state. If strict DRM/anti-leak protection is required in the future, we can evaluate short-lived signed R2 URLs or backend token-gated streaming.
