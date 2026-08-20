# Detailed Step-by-Step Implementation Checklist
## Firebase Cloud Storage (Spark Plan) & Audio Gating Integration

This checklist provides a clear, step-by-step guide to set up **Firebase Cloud Storage (Spark Plan / Free Tier)**, upload your music tracks, dynamically stream previews in the UI, and gate audio playback with a 45-second preview limit that opens a payment checkout.

---

## 📋 Phase 1: Firebase Project & Cloud Storage Setup

- [ ] **Step 1.1: Open Firebase Console**
  - Go to [console.firebase.google.com](https://console.firebase.google.com/) and log in with your Google account.
  - Select your existing project (e.g., `peculiar-site-2` or `peculiar-beats`) or create a new one.

- [ ] **Step 1.2: Activate Cloud Storage**
  - In the left sidebar, click **Build** ➔ **Storage**.
  - Click **Get Started**.
  - Choose **Start in production mode** and click **Next**.
  - Select your Cloud Storage bucket location (e.g., `asia-south1` for India / Asia traffic or `us-central1`).
  - Click **Done**.

- [ ] **Step 1.3: Configure Storage Security Rules**
  - Go to the **Storage** tab ➔ click **Rules**.
  - Replace the editor contents with the following rules:
    ```javascript
    rules_version = '2';
    service firebase.storage {
      match /b/{bucket}/o {
        // 1. Publicly streamable preview clips (128kbps MP3s)
        match /previews/{fileName} {
          allow read: if true;
          allow write: if request.auth != null;
        }
        // 2. Public cover artwork images (WebP/JPG)
        match /artwork/{fileName} {
          allow read: if true;
          allow write: if request.auth != null;
        }
        // 3. Locked full master files (24-bit WAV & 320kbps MP3)
        match /masters/{allPaths=**} {
          allow read: if request.auth != null;
          allow write: if request.auth != null;
        }
      }
    }
    ```
  - Click **Publish**.

- [ ] **Step 1.4: Configure Storage CORS (Cross-Origin Resource Sharing)**
  - *Why*: Allows `https://peculiarbeats.com` and `http://localhost:5173` to stream audio without browser CORS errors.
  - Create a local file named `cors.json`:
    ```json
    [
      {
        "origin": ["http://localhost:5173", "https://peculiarbeats.com", "https://*.web.app", "https://*.firebaseapp.com"],
        "method": ["GET", "HEAD"],
        "maxAgeSeconds": 3600
      }
    ]
    ```
  - Run with Google Cloud SDK (`gsutil` or `gcloud`):
    ```bash
    gsutil cors set cors.json gs://<your-firebase-storage-bucket-name>.appspot.com
    ```

---

## 🎵 Phase 2: Prepare & Upload Audio Files

- [ ] **Step 2.1: Prepare Files on Your Computer**
  - **Preview clips**: Cut each track to 45–60 seconds, export as **128kbps MP3** (~1MB each for fast streaming).
  - **Artwork**: Export square images (800x800px) in **WebP** or **JPG** format (~100KB each).
  - **Full Masters**: Export full Lossless **24-bit WAV** + **320kbps MP3**.

- [ ] **Step 2.2: Create Folders in Firebase Storage**
  - In Firebase Console ➔ **Storage** ➔ **Files**:
  - Click **Create folder** ➔ enter `previews`
  - Click **Create folder** ➔ enter `artwork`
  - Click **Create folder** ➔ enter `masters`

- [ ] **Step 2.3: Upload Files**
  - Open `/previews` and upload your preview MP3s (e.g. `neon-pulse-preview.mp3`, `delhi-after-dark-preview.mp3`).
  - Open `/artwork` and upload your album covers (e.g. `neon-pulse.webp`, `delhi-after-dark.webp`).
  - Open `/masters` and upload the full high-res files (e.g. `neon-pulse-master-24bit.wav`).

---

## 💻 Phase 3: Project Configuration & Firebase SDK

- [ ] **Step 3.1: Copy Firebase Web App Config**
  - In Firebase Console, click the ⚙️ **Project settings** icon (top left).
  - Under **Your apps**, click the `</>` (Web) icon (or select your registered web app).
  - Copy the config object values.

- [ ] **Step 3.2: Add Environment Variables to `.env`**
  - Open `.env` in the project root and add:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key_here
    VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

- [ ] **Step 3.3: Install Firebase SDK**
  ```bash
  npm install firebase
  ```

- [ ] **Step 3.4: Create Firebase Client (`src/services/firebase.js`)**
  ```javascript
  import { initializeApp } from "firebase/app";
  import { getStorage, ref, getDownloadURL } from "firebase/storage";

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  const app = initializeApp(firebaseConfig);
  export const storage = getStorage(app);

  export async function getTrackPreviewUrl(fileName) {
    try {
      const fileRef = ref(storage, `previews/${fileName}`);
      return await getDownloadURL(fileRef);
    } catch (err) {
      console.error("Failed to load Firebase preview:", err);
      return null;
    }
  }
  ```

---

## 🔗 Phase 4: Link Storage URLs in Track Catalog

- [ ] **Step 4.1: Update `src/constants/musicTracks.js`**
  - Replace the placeholder audio and image links with your Firebase Storage URLs:
    ```javascript
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
        coverArt: "https://firebasestorage.googleapis.com/v0/b/<your-bucket>.appspot.com/o/artwork%2Fneon-pulse.webp?alt=media",
        previewUrl: "https://firebasestorage.googleapis.com/v0/b/<your-bucket>.appspot.com/o/previews%2Fneon-pulse-preview.mp3?alt=media",
        paymentUrl: "https://buy.stripe.com/your_neon_pulse_link",
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

## ⏱️ Phase 5: Implement 45-Second Audio Preview Gating

- [ ] **Step 5.1: Add Preview Limit in `src/context/AudioPlayerContext.jsx`**
  - Define `const PREVIEW_LIMIT_SECONDS = 45;`
  - In `handleTimeUpdate`:
    ```javascript
    const handleTimeUpdate = () => {
      const current = audio.currentTime;
      setCurrentTime(current);

      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }

      // Check preview limit cutoff
      if (current >= PREVIEW_LIMIT_SECONDS) {
        audio.pause();
        setIsPlaying(false);
        audio.currentTime = PREVIEW_LIMIT_SECONDS;
        openPurchaseModal(currentTrack);
      }
    };
    ```

- [ ] **Step 5.2: Restrict Scrubber Seeking Beyond 45s**
  - In `seek(fraction)` in `AudioPlayerContext.jsx`:
    ```javascript
    const seek = (fraction) => {
      if (!audioRef.current || isNaN(fraction)) return;
      let targetTime = Math.max(0, Math.min(fraction * (duration || 1), duration));
      
      // If user tries to scrub past preview limit, clamp and prompt paywall
      if (targetTime > PREVIEW_LIMIT_SECONDS) {
        targetTime = PREVIEW_LIMIT_SECONDS;
        openPurchaseModal(currentTrack);
      }
      
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    };
    ```

- [ ] **Step 5.3: Update Player UI (`src/components/player/PersistentAudioPlayer.jsx`)**
  - Show a small "45s Preview Limit" indicator on the scrubber bar to set clear expectations.

- [ ] **Step 5.4: Custom Paywall Messaging (`src/components/player/PurchaseModal.jsx`)**
  - Display headline: `"🎧 Preview Finished — Unlock the Full 24-bit Master WAV & 320kbps MP3 to download & continue listening."`

---

## 💳 Phase 6: Setup Payment Links (Stripe / Razorpay)

- [ ] **Step 6.1: Create Payment Link**
  - In **Stripe Dashboard** (or Razorpay / Instamojo):
  - Go to **Payment Links** ➔ **Create New Link**.
  - Product Name: `Peculiar Beats - Neon Pulse (Lossless Master WAV + MP3)`.
  - Amount: `$4.99` (or `₹399`).
  - **After Payment Confirmation**: Set redirect URL to your master file download page (e.g. `https://peculiarbeats.com/releases?payment=success&track=neon-pulse` or Google Drive/Firebase download link).

- [ ] **Step 6.2: Link into `src/constants/musicTracks.js`**
  - Set `paymentUrl: "https://buy.stripe.com/..."` for each track entry.

---

## 🧪 Phase 7: Verification & Testing

- [ ] **Step 7.1: Streaming Test**
  - Navigate to `http://localhost:5173/releases`.
  - Click **Play** on a track ➔ Verify audio streams from Firebase Storage without delay.

- [ ] **Step 7.2: 45-Second Cutoff Test**
  - Let track play to 45 seconds ➔ Verify audio pauses automatically.
  - Verify `PurchaseModal` opens automatically with selected track title and price.

- [ ] **Step 7.3: Seeking Barrier Test**
  - Drag the scrubber past 45 seconds ➔ Verify it halts at 45s and prompts the purchase modal.

- [ ] **Step 7.4: Checkout Redirect Test**
  - Click **"Unlock & Download Now"** ➔ Verify it redirects to your Stripe/Razorpay checkout page.

- [ ] **Step 7.5: Production Build Test**
  - Run `npm run build` ➔ Verify 0 build errors.
  - Deploy to Firebase Hosting: `firebase deploy`.
