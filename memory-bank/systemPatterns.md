# System Patterns: Peculiar Site 2.0

## 1. Core Architecture & Design Patterns

### 🎧 Audio Player Singleton & Context Pattern
- A single `AudioPlayerContext` (`src/context/AudioPlayerContext.jsx`) manages a shared HTML5 `Audio` instance.
- **Preview Gating Pattern**:
  - Unlocked tracks play full-length audio (`fullAudioUrl`).
  - Unpurchased tracks are clamped to `PREVIEW_LIMIT_SECONDS = 45`.
  - When `currentTime >= 45`, playback automatically pauses, the scrubber locks at 45s, and the paywall modal (`PurchaseModal.jsx`) is triggered.
- **Route Isolation Pattern**:
  - The persistent audio player (`PersistentAudioPlayer.jsx`) and modal (`PurchaseModal.jsx`) are strictly rendered on `/releases` (and associated sub-routes).
  - Navigation away from `/releases` automatically halts playback to prevent audio leaks across the site.

### 🍱 Bento Grid & Tonal Layering UI System
- **Grid Layout**: 12-column desktop grid with 8px rhythm multiples (margins, gutters, card padding).
- **Tonal Elevation**: 
  - Canvas: Pure Dark Obsidian (`#0b0813` / `#19101c`).
  - Containers / Cards: Deep Charcoal (`#140b16` / `#221824` / `#261c28`) with 1px borders (`#514254` / `outline-variant`).
  - Active States: High-contrast Electric Purple (`#bf00ff`) border glow and accent highlights.
- **Performance Layering**:
  - Avoids expensive CSS `background-attachment: fixed` on body by using GPU-accelerated fixed pseudo-elements with `transform: translateZ(0)` and `contain: strict`.

### 💳 Cryptographic Order & Payment Flow
1. **Order Creation**: Frontend calls `/api/create-order` with track metadata. Backend converts INR to paise and calls Razorpay API.
2. **Standard Checkout**: Frontend dynamically loads `https://checkout.razorpay.com/v1/checkout.js` and opens the modal.
3. **Signature Verification**: On checkout completion, frontend sends `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature` to `/api/verify-payment`.
4. **Validation**: Backend calculates expected HMAC SHA-256 signature using `RAZORPAY_KEY_SECRET` and performs constant-time comparison via `crypto.timingSafeEqual`.
5. **State Unlock**: Upon success, frontend updates `localStorage`, un-gates audio, and updates URL to `?payment=success&track=<id>` to show celebration banner and download button.

---

## 2. Directory Structure & Conventions

```
peculiar-site-2.0/
├── memory-bank/              # Long-term agent memory & architecture docs
├── netlify/functions/        # Production Netlify serverless endpoints
├── server/                   # Shared backend business logic (Razorpay service)
├── public/                   # Static media (videos, thumbnails, logos)
└── src/
    ├── components/
    │   ├── booking/          # Isolated booking form inputs & confetti controls
    │   ├── layout/           # App Header, Footer, and Navigation
    │   ├── pages/            # Top-level route components (HomePage, ReleasesPage)
    │   ├── player/           # Persistent player bar & purchase modal
    │   ├── sections/         # Modular homepage bento sections (Hero, Stats, Media, etc.)
    │   └── ui/               # Reusable micro-components (VinylMark, EqualizerBars, Dividers)
    ├── constants/            # Site catalog data, tracks, images, social links
    ├── context/              # React context providers (AudioPlayerContext)
    ├── hooks/                # Custom React hooks (useAudioPlayer, useAmbientTheme, etc.)
    ├── utils/                # Helper functions (date formatters, Razorpay SDK loader)
    ├── styles.css            # Tailwind directives, animations & custom styles
    └── main.jsx              # Application entry point with BrowserRouter
```

---

## 3. Strict Do's and Don'ts for Future Development

### ✅ DO's
- **DO** route all audio playback through `useAudioPlayer()` hook and the centralized `AudioPlayerContext`.
- **DO** use server-side verification (`/api/verify-payment`) with constant-time cryptographic checks before unlocking purchases.
- **DO** keep API endpoints uniform (`/api/create-order`, `/api/verify-payment`) so they seamlessly work via Vite middleware in local development and Netlify Functions in production.
- **DO** follow the 8px spacing grid and Sonic Vanguard design tokens from `DESIGN.md` and `tailwind.config.js`.
- **DO** check `isTrackUnlocked(track.id)` before granting access to uncompressed master audio URLs or allowing seeking past 45s.
- **DO** keep routing fallbacks up to date in both `netlify.toml` and `firebase.json`.

### ❌ DON'Ts
- **DON'T** instantiate secondary `new Audio()` objects in components; always use the context singleton.
- **DON'T** display the music player bar or trigger audio popups outside the `/releases` route.
- **DON'T** expose `RAZORPAY_KEY_SECRET` in any client-facing code or `VITE_` prefixed environment variables.
- **DON'T** use `background-attachment: fixed` anywhere in CSS, as it causes massive scroll jank on mobile devices.
- **DON'T** hardcode third-party API keys in source files; always reference `import.meta.env.*` or `process.env.*`.
- **DON'T** use standard generic web colors (pure red, green, blue); always use the designated HSL/Hex palette tokens (`primary`, `on-surface`, `surface-container-high`).
