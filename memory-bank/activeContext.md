# Active Context: Peculiar Site 2.0

## 1. Current Work Focus
The project is currently on git branch **`feature/releases-audio-player`**.

The active development focus has been upgraded to the **Playlist-based Sonic Vault (`/releases`)** catalog, Cloudflare R2 expiring pre-signed download URLs (`@aws-sdk/s3-request-presigner`), Razorpay UPI QR code payment flow (`/api/create-qr`, `/api/check-qr-status`), and 45-second preview gating per track.

---

## 2. Recent Key Milestones & Changes

1. **Playlist-Based Catalog Overhaul**:
   - Restructured `src/constants/musicTracks.js` into playlist objects (`musicPlaylists`) containing multiple tracks per release (e.g. Neon Pulse EP, Delhi Nights Pack, Cyber Odyssey EP, Bass Weapons Vol. 1, Bollywood Fusion Pack, Free Sampler Pack).
   - Added support for free playlists (`isFree: true`) with instant direct download links.

2. **Razorpay Dynamic UPI QR Code Payment Flow**:
   - Built server-side QR creation (`/api/create-qr`) and status polling (`/api/check-qr-status`) in `server/razorpayService.js` and Netlify functions.
   - Designed interactive modal flow in `PurchaseModal.jsx` displaying dynamic UPI QR, 10-minute live countdown timer, and automatic payment detection.

3. **Cloudflare R2 Expiring Pre-signed Download URLs**:
   - Created `server/r2Service.js` and `/api/generate-download` endpoint leveraging AWS S3 SDK v3 client to generate 1-hour expiring download URLs for purchased/unlocked WAV masters.

4. **Playlist-Aware Audio Player Context & Scoping**:
   - Updated `AudioPlayerContext.jsx` and `PersistentAudioPlayer.jsx` to navigate and manage state at the playlist level.
   - Enforced 45s preview ceiling per track on locked playlists and unlocked full master playback across all tracks on unlock.

---

## 3. Current Roadblocks & Pending Tasks

1. **Upload Complete Master & Preview Audio to Cloudflare R2**:
   - Upload high-res 128kbps preview MP3s and 24-bit WAV master packages for all playlist tracks into Cloudflare R2 bucket.

2. **Configure Production Cloudflare R2 & Razorpay Credentials**:
   - Set `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET` in production hosting (Netlify / `.env`).

