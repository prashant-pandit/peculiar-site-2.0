import React from "react";

// A single small SVG element with a transform-only rotation - cheap enough
// to spin continuously without the scroll-jank issues a full-page
// animated background caused.
export default function VinylMark() {
  return (
    <span className="vinyl-mark" aria-hidden="true">
      <svg viewBox="0 0 40 40" width="28" height="28">
        <defs>
          <linearGradient id="vinylRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff00bf" />
            <stop offset="100%" stopColor="#00ffff" />
          </linearGradient>
          <radialGradient id="vinylLabel" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff37d0" />
            <stop offset="100%" stopColor="#7b2dff" />
          </radialGradient>
        </defs>
        <circle cx="20" cy="20" r="18.5" fill="#0b0813" stroke="url(#vinylRing)" strokeWidth="1.2" />
        <circle cx="20" cy="20" r="14" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <circle cx="20" cy="20" r="9.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <circle cx="20" cy="20" r="5.5" fill="url(#vinylLabel)" />
        <circle cx="20" cy="20" r="1.6" fill="#0b0813" />
      </svg>
    </span>
  );
}
