import React from "react";
import { Play } from "lucide-react";
import { images } from "../../constants";

function MusicStringWave() {
  const strings = [
    "M7 25 C18 13 28 13 39 25 S61 37 72 25 S94 13 105 25 S127 37 138 25 S160 13 173 25",
    "M7 25 C19 37 28 37 40 25 S61 13 73 25 S94 37 106 25 S127 13 139 25 S160 37 173 25",
    "M7 25 C21 19 28 31 40 25 S60 19 73 25 S93 31 106 25 S126 19 139 25 S159 31 173 25",
  ];

  return (
    <div className="music-string-wave" aria-hidden="true">
      <svg viewBox="0 0 180 42" role="presentation">
        {strings.map((path, index) => (
          <g
            className={`music-string-layer music-string-layer-${index + 1}`}
            key={path}
          >
            <path className="music-string music-string-glow" d={path} />
            <path className="music-string" d={path} />
            <path className="music-string music-string-trail" d={path} />
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[820px] items-center justify-center overflow-hidden px-margin-mobile md:px-margin-desktop">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={images.hero}
        aria-label="Peculiar Beats performance background"
      >
        <source src={images.heroVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-background/80" />
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        <h1 className="hero-title font-syne font-extrabold text-on-surface">
          Unique music. Limitless energy.<br />
          <br />
          One mission — keep the dance floor alive.
        </h1>
        <MusicStringWave />
        <div className="mt-8 flex flex-col justify-center gap-5 sm:flex-row">
          <a href="#booking" className="btn-primary">
            Book for Event
          </a>
          <a href="#releases" className="btn-outline">
            <Play size={16} fill="currentColor" />
            Listen to Mixes
          </a>
        </div>
      </div>
    </section>
  );
}
