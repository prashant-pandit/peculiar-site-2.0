import React from "react";

const BAR_COUNT = 28;
const PINK = [255, 55, 208];
const CYAN = [45, 125, 255];

function mix(a, b, t) {
  return a + (b - a) * t;
}

function mixRgb(c1, c2, t) {
  return [mix(c1[0], c2[0], t), mix(c1[1], c2[1], t), mix(c1[2], c2[2], t)];
}

function toRgbString([r, g, b]) {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

// Static waveform shape computed once at module load - no timers, no
// randomness, no animation. Renders once and never repaints.
const BARS = Array.from({ length: BAR_COUNT }, (_, index) => {
  const t = index / (BAR_COUNT - 1);
  const envelope = 0.25 + 0.75 * Math.pow(Math.sin(Math.PI * t), 0.7);
  const jitter = 0.12 * Math.sin(t * 23.5) + 0.08 * Math.sin(t * 9.1 + 1);
  const height = Math.min(1, Math.max(0.12, envelope + jitter));

  return { height, color: toRgbString(mixRgb(PINK, CYAN, t)) };
});

export default function WaveformDivider() {
  return (
    <div className="waveform-divider" aria-hidden="true">
      {BARS.map((bar, index) => (
        <span
          key={index}
          className="waveform-divider-bar"
          style={{ height: `${bar.height * 100}%`, backgroundColor: bar.color }}
        />
      ))}
    </div>
  );
}
