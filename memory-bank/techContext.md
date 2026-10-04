# Technical Context: Peculiar Site 2.0

## 1. Frontend Technology Stack
- **Core Framework**: React 18+ / 19 (`react`, `react-dom`) with JSX.
- **Build Tool & Bundler**: Vite 5 (`vite`, `@vitejs/plugin-react`).
- **Routing**: React Router DOM v7 (`react-router-dom`) with deep-link parameter parsing (`useSearchParams`, `useLocation`, `useNavigate`).
- **Styling & Design Tokens**: 
  - Tailwind CSS v3.4.17 (`tailwindcss`, `postcss`, `autoprefixer`).
  - Custom typography: **Syne** (Google Fonts) for display titles; **Inter** (Google Fonts) for UI copy and metadata tags.
  - Custom color tokens: Electric Purple (`#ecb1ff`, `#bf00ff`), dark midnight obsidian backgrounds (`#19101c`, `#0b0813`), surface hierarchy (`#140b16`, `#221824`, `#261c28`, `#312733`).
- **Icons & Animation**:
  - `lucide-react` (modern minimalist UI icons).
  - `react-icons` (brand icons: Instagram, WhatsApp, SoundCloud, YouTube).
  - `react-slick` & `slick-carousel` (touch-enabled media carousel).
  - `canvas-confetti` (interactive booking celebration triggers).

---

## 2. Backend, Serverless & API Layer
- **Local Development API Proxy**:
  - Vite development server middleware (`razorpayApiPlugin` in `vite.config.js`) intercepting local requests to `/api/create-order` and `/api/verify-payment`.
- **Production Serverless Architecture**:
  - Netlify Functions (`netlify/functions/create-order.js`, `netlify/functions/verify-payment.js`) defined in `netlify.toml`.
  - Service Module (`server/razorpayService.js`): Centralized order creation and cryptographic signature verification.
- **Payment Processing**:
  - `razorpay` Node.js SDK for server-side order generation.
  - Native Node.js `crypto` for constant-time HMAC SHA-256 signature verification (`crypto.timingSafeEqual`).
- **Notification Services**:
  - Telegram Bot API (`https://api.telegram.org/bot<TOKEN>/sendMessage`) for real-time booking notifications.
- **External Media APIs**:
  - YouTube Data API v3 (`https://www.googleapis.com/youtube/v3/search`) for automated channel video imports.

---

## 3. Storage & Media Infrastructure
- **Cloud Storage**: **Cloudflare R2 Object Storage** (Free Tier - 10GB storage, 10M Class B reads/month, **$0.00 egress bandwidth fees**).
  - Bucket Name: `peculiar-beats-audio`
  - Public Endpoint: `https://pub-f1a3f69c340e4dec8fda3b8eb74ce3ce.r2.dev` (or custom domain `audio.peculiarbeats.com`).
  - Directory Hierarchy:
    - `previews/`: 128kbps lightweight MP3 clips (~1MB each) for instant streaming.
    - `artwork/`: Square album artwork (WebP/JPG).
    - `masters/`: Full-length uncompressed 24-bit Lossless WAVs + 320kbps MP3s.
- **Client-Side State Storage**: `localStorage` key `pb_unlocked_tracks` for persisting purchased music tracks across sessions.
- **Static Assets**: Stored in `public/` (local video clips `hero-bg.mp4`, `media1-3.mp4`, partner logos, brand marks).

---

## 4. Environment Configuration
The project relies on environment variables defined in `.env`:
```ini
# Razorpay Credentials
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx

# Telegram Lead Notifications
VITE_TELEGRAM_BOT_TOKEN=xxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_TELEGRAM_CHAT_ID=-xxxxxxxxxxxxxxxxx

# YouTube Data API
VITE_YOUTUBE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 5. Development & Deployment Workflow
- **Local Development**:
  ```bash
  npm run dev          # Starts Vite dev server with embedded Razorpay API middleware on 127.0.0.1:5173
  ```
- **Production Build**:
  ```bash
  npm run build        # Compiles React app to /dist with esbuild minification & vendor chunk splitting
  npm run preview      # Previews production build locally
  ```
- **Deployment Targets**:
  - **Netlify**: Auto-builds from git via `netlify.toml` with serverless function routing.
  - **Firebase Hosting**: Configured via `firebase.json` with cache-control headers for static media and SPA rewrite rules.
