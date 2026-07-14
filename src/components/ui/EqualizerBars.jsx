import React from "react";

// Only ever mounted while something is actually playing, so the
// animation's runtime cost is bounded to real playback, not idle time.
export default function EqualizerBars({ className = "" }) {
  return (
    <span className={`eq-bars ${className}`} aria-hidden="true">
      <span className="eq-bar" />
      <span className="eq-bar" />
      <span className="eq-bar" />
      <span className="eq-bar" />
    </span>
  );
}
