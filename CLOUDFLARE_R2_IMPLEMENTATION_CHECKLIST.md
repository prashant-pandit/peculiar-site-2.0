# Step-by-Step Implementation Checklist: Cloudflare R2 & Audio Gating

This detailed checklist guides you through setting up **Cloudflare R2 Storage (Free Tier)**, creating an audio bucket, enabling public access/CORS, linking the URLs into your React web app, and testing the 45-second preview gating paywall.

---

## 📋 Phase 1: Cloudflare R2 Bucket Creation & Public Access

- [ ] **Step 1.1: Log in to Cloudflare Dashboard**
  - Go to [dash.cloudflare.com](https://dash.cloudflare.com/) and log in (or sign up for free).
  - In the left sidebar, click **R2 Object Storage**.

- [ ] **Step 1.2: Create a Storage Bucket**
  - Click **Create bucket**.
  - **Bucket name**: `peculiar-beats-audio` (or any preferred lowercase name).
  - **Location**: Select *Automatic* or choose your nearest region.
  - Click **Create Bucket**.

- [ ] **Step 1.3: Enable Public Access (R2.dev or Custom Domain)**
  - In your bucket view, go to the **Settings** tab.
  - Scroll to **Public Access**:
    - **Option A (Instant - `r2.dev`)**: Under *R2.dev subdomain*, click **Allow Access** -> type `allow` to confirm. Copy the public URL (e.g., `https://pub-a1b2c3d4e5.r2.dev`).
    - **Option B (Custom Domain - Recommended)**: Click **Connect Domain** -> enter `audio.peculiarbeats.com` (Cloudflare will automatically manage SSL certificates and edge CDN caching).

- [ ] **Step 1.4: Configure CORS Policy**
  - In the bucket **Settings** tab, scroll to **CORS Policy** -> click **Add CORS policy**.
  - Paste the following JSON:
    ```json
    [
      {
        "AllowedOrigins": [
          "http://localhost:5173",
          "https://peculiarbeats.com",
          "https://*.web.app",
          "https://*.firebaseapp.com"
        ],
        "AllowedMethods": ["GET", "HEAD"],
        "AllowedHeaders": ["*"],
        "MaxAgeSeconds": 3600
      }
    ]
    ```
  - Click **Save**.

---

## 🎵 Phase 2: Prepare & Upload Audio Files

- [ ] **Step 2.1: Prepare Your Music Files**
  - **Preview clips**: Cut each track to 45–60 seconds, export as **128kbps MP3** (~1MB each for ultra-fast instant streaming).
  - **Artwork**: Export square 800x800px album covers in **WebP** or **JPG** format (~100KB).
  - **Full Masters**: Export uncompressed Lossless **24-bit WAV** + **320kbps MP3**.

- [ ] **Step 2.2: Upload Files directly in Cloudflare Dashboard**
  - Open your bucket in Cloudflare R2 -> click **Objects** tab:
  - Click **Upload** ➔ **Upload Folder** (or upload files directly):
    - Upload preview files to a `previews/` folder (e.g., `previews/neon-pulse-preview.mp3`).
    - Upload artwork files to an `artwork/` folder (e.g., `artwork/neon-pulse.webp`).
    - (Optional) Upload master files to a `masters/` folder.

- [ ] **Step 2.3: Verify Public URL in Browser**
  - Test opening one preview file directly in your browser:
    `https://<your-r2-public-url>/previews/neon-pulse-preview.mp3`
  - Verify that the MP3 plays immediately.

---

## 🔗 Phase 3: Link Cloudflare R2 URLs into Track Catalog

- [ ] **Step 3.1: Update `src/constants/musicTracks.js`**
  - Define your base R2 CDN URL at the top of the file:
    ```javascript
    // Cloudflare R2 Public Endpoint (or custom domain audio.peculiarbeats.com)
    const R2_BASE = "https://pub-xxxxxxxxxxxx.r2.dev";

    export const musicTracks = [
      {
        id: "neon-pulse",
        title: "Neon Pulse",
        subtitle: "Festival Peak Time Mix",
        artist: "Peculiar Beats",
        genre: "Peak Time Techno",
        bpm: 130,
        key: "Fm",
        duration: "4:12",
        durationSec: 252,
        price: "$4.99",
        priceInr: "₹399",
        coverArt: `${R2_BASE}/artwork/neon-pulse.webp`,
        previewUrl: `${R2_BASE}/previews/neon-pulse-preview.mp3`,
        paymentUrl: "https://buy.stripe.com/your_stripe_link_here",
        downloadUrl: "#",
        tags: ["Festival Ready", "Heavy Bass", "24-bit WAV Included"],
        description: "Driving underground techno with hypnotic modular synth leads.",
        isExclusive: true,
        isPopular: true,
      },
      // Repeat for remaining tracks...
    ];
    ```

---

## ⏱️ Phase 4: Implement 45-Second Audio Preview Gating (Completed ✅)

- [x] **Step 4.1: Add 45-Second Limit in `src/context/AudioPlayerContext.jsx`**
  - Added `PREVIEW_LIMIT_SECONDS = 45` and auto-pause when limit is reached.
- [x] **Step 4.2: Enforce Seeking Restriction**
  - Added clamp in `seek(fraction)` preventing scrubbing beyond 45s prior to purchase.
- [x] **Step 4.3: Update Player & Modal UI**
  - Added 45s preview indicator, locked scrubber tooltip, and 45s preview ended alert with "Replay Preview" in `PurchaseModal.jsx`.

---

## 💳 Phase 5: Payment Links Setup (Stripe or Razorpay)

- [ ] **Step 5.1: Create Stripe / Razorpay Hosted Payment Links**
  - In your **Stripe Dashboard** (or Razorpay / Instamojo):
  - Click **Payment Links** ➔ **Create Link**.
  - Product Name: `Peculiar Beats - Neon Pulse (24-bit Master WAV + MP3)`.
  - Amount: `$4.99` (or `₹399`).
  - Set **Post-Payment Redirect URL**:
    - Direct download link (Google Drive / Cloudflare R2 temporary signed link) OR
    - `https://peculiarbeats.com/releases?payment=success&track=neon-pulse`

- [ ] **Step 5.2: Update `paymentUrl` in `src/constants/musicTracks.js`**
  - Paste the live checkout URL for each track.

---

## 🧪 Phase 6: Testing & Launch Verification

- [ ] **Step 6.1: Streaming Verification**
  - Open `http://localhost:5173/releases`.
  - Click **Play** on a track ➔ Verify instant audio streaming from Cloudflare R2 edge CDN with 0 delay.

- [ ] **Step 6.2: 45-Second Cutoff Verification**
  - Let playback reach 45 seconds ➔ Verify audio pauses automatically.
  - Verify `PurchaseModal` opens immediately with track details and checkout button.

- [ ] **Step 6.3: Scrubber Restriction Verification**
  - Drag the scrubber timeline past 45s ➔ Confirm it stops at 45s and prompts the paywall modal.

- [ ] **Step 6.4: Checkout Button Test**
  - Click **Unlock & Download** in the modal ➔ Confirm it redirects to your Stripe/Razorpay payment page.

- [ ] **Step 6.5: Production Build & Deploy**
  - Run `npm run build` to confirm 0 compilation errors.
  - Deploy to your hosting provider (Firebase Hosting or Netlify):
    ```bash
    npm run build
    firebase deploy
    ```
