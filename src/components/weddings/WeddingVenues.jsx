import React from "react";
import { weddingVenues } from "../../constants/weddings.data";

export default function WeddingVenues() {
  return (
    <section className="w-full bg-[#F8F4E8] py-16 sm:py-20 md:py-28 border-y border-[#E4DAC8]">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 md:px-16">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14">
          <span className="block text-[11px] sm:text-xs font-manrope font-semibold uppercase tracking-[0.22em] text-[#7A786B] mb-2">
            HERITAGE & PALACES
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-normal text-[#1F1F1A] tracking-tight">
            VENUES WE'VE CELEBRATED AT
          </h2>
        </div>

        {/* 3-Column Venue Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {weddingVenues.map((venue) => (
            <div
              key={venue.name}
              className="flex flex-col justify-center rounded-xl bg-[#FFFDF8] border border-[#E4DAC8] p-6 sm:p-7 shadow-sm transition-all duration-300 hover:border-[#D8C49A] hover:shadow-md"
            >
              <h3 className="font-playfair text-lg sm:text-xl font-normal text-[#1F1F1A]">
                {venue.name}
              </h3>
              <p className="mt-1 text-xs sm:text-sm font-manrope text-[#7A786B]">
                {venue.city}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
