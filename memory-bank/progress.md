# Progress: Peculiar Site 2.0

## 1. Core Architecture & Design System
- [x] Set up React 18+ and Vite 5 build pipeline.
- [x] Configure Tailwind CSS with custom Sonic Vanguard design tokens and palette (`#19101c`, `#bf00ff`, `#eeddee`).
- [x] Implement Syne and Inter typography hierarchy with `label-caps` and bento card styles.
- [x] Configure GPU-accelerated background layers to eliminate mobile scroll lag.
- [x] Set up React Router DOM v7 SPA routing with redirects for legacy routes (`/release`, `/musictrack`).

---

## 2. Homepage & Artist Showcase
- [x] Hero Section with looping background video and primary CTA buttons.
- [x] Live performance stats counter (600+ Events, 20+ Cities, 100+ Venues).
- [x] Client and partner logo carousel (Fern Hotels, Eventopia, Insomnia, etc.).
- [x] Artist biography & introduction section with high-res photography.
- [x] Media section with video previews and animated equalizers.
- [x] YouTube release carousel with real-time video fetching via YouTube Data API v3 and `postMessage` player state sync.
- [x] Experience curation bento section (Club & Nightlife, Corporate Galas, Luxury Weddings).
- [x] Animated Waveform SVG section dividers.

---

## 3. Sonic Vault & Releases Catalog (`/releases`)
- [x] High-performance track catalog layout with responsive bento cards.
- [x] Genre filtering pills (Peak Time Techno, Afro & Tech House, Melodic Techno, Bass & UK Garage, Bollywood Fusion, Deep Progressive).
- [x] Search input supporting titles, genres, BPM, and descriptive tags.
- [x] Multi-option sorting (Featured, Latest First, BPM Ascending / Descending).
- [x] Deep-link handling for Instagram/social marketing (`/releases?track=<id>`) with auto-play and scroll-to-view.
- [x] Post-payment celebration banner (`?payment=success&track=<id>`) with direct WAV download action.
- [x] Custom inquiries & VIP dubplate inquiry bento banner.

---

## 4. Persistent Audio Player & Preview Gating
- [x] Centralized `AudioPlayerContext` managing a single HTML5 `Audio` instance.
- [x] Persistent bottom player bar with play/pause, next/prev, volume slider, and track metadata.
- [x] Route isolation ensuring the player only renders on `/releases` and pauses on navigation away.
- [x] 45-second preview gating engine for unpurchased tracks.
- [x] Scrubber timeline clamping preventing scrub beyond 45s for locked tracks.
- [x] Visual timeline marker indicating the 45s preview limit on the progress bar.
- [x] Interactive `PurchaseModal` with track details, pricing in INR/USD, and package inclusions.
- [x] Replay preview functionality from within the purchase modal.
- [x] Local storage persistence (`pb_unlocked_tracks`) for unlocked music tracks.

---

## 5. Cloudflare R2 Audio Infrastructure
- [x] Cloudflare R2 architecture design document (`CLOUDFLARE_R2_AUDIO_STORAGE_PLAN.md`).
- [x] Cloudflare R2 implementation checklist (`CLOUDFLARE_R2_IMPLEMENTATION_CHECKLIST.md`).
- [x] Public bucket configuration (`https://pub-f1a3f69c340e4dec8fda3b8eb74ce3ce.r2.dev`).
- [x] Sample/preview track and master audio stream links connected in `src/constants/musicTracks.js`.
- [ ] Upload final 128kbps preview MP3s for all tracks in `musicTracks.js` to R2 bucket.
- [ ] Upload full 24-bit Lossless WAV + 320kbps MP3 packages to R2 bucket.
- [ ] Connect custom subdomain (`audio.peculiarbeats.com`) to Cloudflare R2 bucket.

---

## 6. Razorpay Payment Integration & Delivery
- [x] Razorpay payment plan document (`RAZORPAY_PAYMENT_SETUP_PLAN.md`).
- [x] Dynamic Razorpay Standard Web Checkout script loader in `src/utils/razorpayCheckout.js`.
- [x] Server-side order creation service in `server/razorpayService.js`.
- [x] Constant-time HMAC SHA-256 signature verification in `server/razorpayService.js`.
- [x] Local development API proxy middleware in `vite.config.js` (`/api/create-order`, `/api/verify-payment`).
- [x] Production serverless functions in `netlify/functions/` (`create-order.js`, `verify-payment.js`).
- [x] Razorpay checkout error handling, dismissal handling, and loading states in `PurchaseModal.jsx`.
- [ ] Complete Razorpay business KYC and activate live account.
- [ ] Configure live production API keys (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`).
- [ ] Conduct end-to-end live UPI transaction test.

---

## 7. Booking Concierge & Telegram Pipeline
- [x] Interactive booking form with name, date, event type, and project details.
- [x] Contact method toggle (Phone/WhatsApp vs. Email).
- [x] Custom calendar date picker component.
- [x] Telegram Bot API integration for instant message dispatch to management chat.
- [x] Confetti burst animation upon successful submission.
- [x] WhatsApp direct-chat deep links with pre-filled event inquiry text.

---

## 8. Deployment, Performance & SEO
- [x] Netlify deployment configuration with serverless redirects in `netlify.toml`.
- [x] Firebase Hosting configuration with asset cache headers and SPA rewrites in `firebase.json`.
- [x] Sitemap (`public/sitemap.xml`) and Web Manifest (`public/site.webmanifest`).
- [x] Optimized chunk splitting in `vite.config.js` for React, Lucide icons, and React Slick.
- [ ] Verify production deployment on live custom domain (`peculiarbeats.com`).
