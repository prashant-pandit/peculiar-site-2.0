# Project Context: Peculiar Site 2.0

## Overview
**Peculiar Site 2.0** is an interactive, modern portfolio & booking web application for an electronic music artist / DJ ("Sonic Vanguard" / "Peculiar").

## Tech Stack
- **Framework & Build Tool**: React 18 + Vite (ES modules)
- **Styling**: Tailwind CSS + custom CSS (`src/styles.css`) + PostCSS / Autoprefixer
- **UI & Icons**: Lucide React, React Icons (`react-icons`), React Slick / Slick Carousel
- **Hosting / Deploy Target**: Firebase (`firebase.json`, `.firebaserc`) & Netlify configuration
- **Audio & Media Storage**: Cloudflare R2 Storage (Zero egress fees & Global CDN)

## Project Architecture
- `src/`
  - `components/`
    - `layout/`: Header, Footer
    - `sections/`: HeroSection, StatsSection, PartnersSection, IntroSection, MediaSection, ReleasesSection, ExperiencesSection, BookingSection
    - `booking/`: Booking modal / forms
    - `ui/`: WaveformDivider, common interactive widgets
  - `hooks/`: Custom React hooks (e.g., `useAmbientTheme`)
  - `constants/`: App constants, copy, and navigation data
  - `utils/`: Helper utilities
  - `styles.css`: Global styles & theme definitions
  - `App.jsx`, `main.jsx`: Core entry point and layout assembly
- `public/`: Static audio, images, and public assets
- `DESIGN.md`: Design system specifications ("Sonic Vanguard")

## Design System & Rules ("Sonic Vanguard")
- **Theme & Aesthetic**: Dark Minimalism + Swiss Modernism (nocturnal energy, hardware-inspired precision, bento box grid).
- **Core Palette**:
  - Void Canvas / Background: `#19101c` / `#000000`
  - Bento Surface: `#261c28` / `#121212` with subtle borders (`#1E1E1E` / `#514254`)
  - Accent / Sonic Strike: Electric Purple (`#bf00ff` / `#ecb1ff`) for CTAs, active states, and highlights
  - Typography: **Syne** (Headings / Brutalist impact) and **Inter** (Body / UI labels)
- **Grid Layout**: Bento box model (multiples of 8px, 12-column desktop / 4-column mobile).
