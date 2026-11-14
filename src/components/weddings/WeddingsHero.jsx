import React from "react";

export default function WeddingsHero() {
  return (
    <section className="relative w-full h-[88vh] min-h-[580px] max-h-[920px] overflow-hidden bg-[#1F1F1A]">
      {/* Cinematic Background Image */}
      <img
        src="/images/weddings/cinematic_luxury_indian_destination_wedding_celebration_at_night_with_warm.png"
        alt="Royal luxury destination wedding celebration at night with warm palace lighting"
        className="absolute inset-0 w-full h-full object-cover object-[center_35%]"
        loading="eager"
        fetchpriority="high"
      />

      {/* Top subtle vignette for navbar legibility */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/65 via-black/25 to-transparent pointer-events-none" />

      {/* Bottom gradient overlay for editorial text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Hero Content positioned over lower-left */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-end px-6 pb-14 sm:px-10 sm:pb-16 md:px-16 md:pb-20">
        <div className="max-w-2xl">
          <span className="inline-block text-[11px] sm:text-xs font-manrope font-semibold uppercase tracking-[0.24em] text-[#D8C49A] mb-3">
            WEDDING
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-normal leading-[1.08] text-white tracking-tight">
            Where the celebration comes
            <br />
            alive.
          </h1>
          <p className="mt-4 sm:mt-5 max-w-xl font-manrope text-sm sm:text-base font-normal text-white/85 leading-relaxed">
            Peculiar Beats brings music, energy and unforgettable moments to weddings across India.
          </p>
        </div>
      </div>
    </section>
  );
}
