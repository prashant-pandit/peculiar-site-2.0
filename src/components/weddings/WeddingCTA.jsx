import React from "react";

export default function WeddingCTA() {
  const handleBookNow = (e) => {
    e.preventDefault();
    // Navigate to homepage booking section smoothly
    window.location.href = "/#booking";
  };

  return (
    <section className="w-full bg-[#DDE5C8] py-16 sm:py-20 md:py-24 text-center">
      <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <span className="block text-[11px] sm:text-xs font-manrope font-bold uppercase tracking-[0.24em] text-[#586240] mb-3">
          RESERVATION
        </span>
        <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-normal leading-[1.15] text-[#1F1F1A] tracking-tight mb-4">
          LET'S MAKE YOUR WEDDING
          <br />
          UNFORGETTABLE.
        </h2>
        <p className="font-manrope text-sm sm:text-base font-normal text-[#38382F] mb-8">
          Music, energy and unforgettable moments.
        </p>
        <div>
          <a
            href="/#booking"
            onClick={handleBookNow}
            className="inline-flex items-center justify-center rounded-full bg-[#1F1F1A] px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm font-manrope font-semibold uppercase tracking-[0.16em] text-[#FFFDF8] shadow-md transition-all duration-300 hover:bg-[#38382F] hover:ring-1 hover:ring-[#D8C49A] active:scale-95"
          >
            BOOK NOW
          </a>
        </div>
      </div>
    </section>
  );
}
