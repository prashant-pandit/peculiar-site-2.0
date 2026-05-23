---
name: Sonic Vanguard
colors:
  surface: '#19101c'
  surface-dim: '#19101c'
  surface-bright: '#403643'
  surface-container-lowest: '#140b16'
  surface-container-low: '#221824'
  surface-container: '#261c28'
  surface-container-high: '#312733'
  surface-container-highest: '#3c313e'
  on-surface: '#eeddee'
  on-surface-variant: '#d5c0d7'
  inverse-surface: '#eeddee'
  inverse-on-surface: '#372d3a'
  outline: '#9d8ba0'
  outline-variant: '#514254'
  surface-tint: '#ecb1ff'
  primary: '#ecb1ff'
  on-primary: '#520070'
  primary-container: '#bf00ff'
  on-primary-container: '#ffffff'
  inverse-primary: '#9900ce'
  secondary: '#c8c6c5'
  on-secondary: '#303030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#ffb960'
  on-tertiary: '#472a00'
  tertiary-container: '#a76900'
  on-tertiary-container: '#ffffff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#f9d8ff'
  primary-fixed-dim: '#ecb1ff'
  on-primary-fixed: '#320046'
  on-primary-fixed-variant: '#75009e'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1b1c'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb960'
  on-tertiary-fixed: '#2b1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#19101c'
  on-background: '#eeddee'
  surface-variant: '#3c313e'
typography:
  display-xl:
    fontFamily: Syne
    fontSize: 96px
    fontWeight: '800'
    lineHeight: '1.0'
    letterSpacing: -0.04em
  display-lg:
    fontFamily: Syne
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Syne
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Syne
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 80px
  container-max: 1440px
---

## Brand & Style
The design system is engineered for a high-end, electronic music professional. It evokes a sense of technical precision, nocturnal energy, and avant-garde luxury. The personality is authoritative yet enigmatic, prioritizing a "less is more" philosophy that allows the artist's work to breathe.

The visual style is a fusion of **Dark Minimalism** and **Swiss-inspired Modernism**. It leverages high-contrast accents against a monochromatic foundation to guide the eye toward critical interactions. This design system avoids the clutter of traditional nightlife aesthetics in favor of a sophisticated, editorial approach found in luxury tech and architectural portfolios.

## Colors
The palette is rooted in the "void"—a combination of absolute midnight black (#000000) for deep backgrounds and deep charcoal (#121212) for elevated surfaces. This creates a natural hierarchy through value rather than color.

**Electric Purple (#BF00FF)** serves as the "sonic strike." It is used with extreme intentionality: only for primary calls to action, active navigation states, and critical data points (like a live "On Air" indicator). 

Neutral tones follow a strict hierarchy: Pure White is reserved for primary headings and body copy to ensure maximum legibility against the dark backdrop, while mid-grays are used for secondary metadata and borders.

## Typography
Typography is the primary visual driver of the design system. **Syne** provides a distinctive, wide, and aggressive geometric feel for headlines, reflecting the "peculiar" nature of the brand. Large display sizes should use tight tracking to create a "wall of text" impact reminiscent of brutalist concert posters.

**Inter** provides the functional counterpoint. It is used for all long-form content and UI labels to ensure the technical specifications and booking details are crystal clear. Use `label-caps` for section headers and small metadata to maintain a clean, organized "bento" look.

## Layout & Spacing
The design system employs a **Bento Box Grid** model. This involves a fixed-column grid (12 columns for desktop, 4 for mobile) where content is grouped into distinct, rounded-edge containers of varying sizes. 

- **Generous Margins:** Desktop layouts should maintain significant outer margins (80px) to frame the content as a gallery piece.
- **Strict Rhythm:** All spacing (padding, gaps, margins) must be multiples of the 8px base unit.
- **The "Bento" Logic:** Elements should span 3, 6, or 12 columns. Smaller 3-column units are perfect for social links or quick stats, while 6-column units house tracklists or bio sections. 
- **Reflow:** On mobile, all bento units stack vertically, maintaining the 24px gutter as a vertical spacer.

## Elevation & Depth
Depth is achieved through **Tonal Layering** rather than traditional shadows. This system rejects soft glows to maintain its "sharp" aesthetic.

1.  **Level 0 (Background):** #000000 (The canvas).
2.  **Level 1 (Bento Containers):** #121212 with a subtle 1px border (#1E1E1E).
3.  **Level 2 (Active/Hover):** When a bento container is hovered, its border color shifts to the primary Electric Purple (#BF00FF).

Instead of shadows, use **Background Blurs** (20px) for navigation bars that overlay the content, creating a "glass" effect that feels high-tech and premium.

## Shapes
The design system uses a "Rounded" (Level 2) approach for containers to soften the high-contrast "brutalist" typography. This creates a more premium, "hardware-inspired" feel (similar to modern audio gear).

- **Standard Containers:** 0.5rem (8px) corner radius.
- **Bento Modules:** 1.5rem (24px) corner radius for large sections to create a distinct modular silhouette.
- **Interactive Elements:** Buttons follow the 8px radius; avoid pill shapes to stay within the structured, geometric theme.

## Components
- **Primary Buttons:** Solid Electric Purple background with Black text. No border. On hover, the button should "glow" via a subtle outer box-shadow of the same color.
- **Bento Cards:** Use #121212 as the base. Content inside should be padded by 32px. Titles inside cards use `headline-md`.
- **Music Player:** A slim, persistent bottom bar. Use a high-contrast white waveform against the #121212 background. Accent the progress bar with Electric Purple.
- **Inputs:** Darker than the container (#000000), 1px border (#1E1E1E), focusing to an Electric Purple border.
- **Chips/Tags:** Used for "Genre" or "BPM." Small, outline-only borders with `label-caps` typography. 
- **Active Indicators:** A small 4px circle of Electric Purple next to "Live" or "Available for Booking" text.