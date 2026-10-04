import React from "react";
import { weddingCities } from "../../constants/weddings.data";

export default function WeddingCities() {
  return (
    <section className="w-full bg-[#FFFDF8] py-16 sm:py-20 md:py-24 text-center">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 md:px-16">
        {/* Section Header */}
        <span className="block text-[11px] sm:text-xs font-manrope font-semibold uppercase tracking-[0.22em] text-[#7A786B] mb-2">
          PRESENCE
        </span>
        <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-normal text-[#1F1F1A] tracking-tight mb-8 sm:mb-12">
          WEDDINGS ACROSS INDIA
        </h2>

        {/* Editorial Horizontal / Wrapped List */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10 sm:gap-y-4 max-w-4xl mx-auto">
          {weddingCities.map((city, index) => (
            <React.Fragment key={city}>
              <span className="font-manrope text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-[#38382F] hover:text-[#1F1F1A] transition-colors">
                {city}
              </span>
              {index !== weddingCities.length - 1 && (
                <span className="text-[#D8C49A] text-xs select-none" aria-hidden="true">
                  •
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
