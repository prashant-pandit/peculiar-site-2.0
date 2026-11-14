import React from "react";
import { weddingPartners } from "../../constants/weddings.data";

export default function WeddingPartners() {
  return (
    <section className="w-full bg-[#FFFDF8] py-16 sm:py-20 md:py-24 text-center">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 md:px-16">
        {/* Section Header */}
        <span className="block text-[11px] sm:text-xs font-manrope font-semibold uppercase tracking-[0.22em] text-[#7A786B] mb-2">
          COLLABORATIONS
        </span>
        <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-normal text-[#1F1F1A] tracking-tight mb-8 sm:mb-12">
          OUR WEDDING PARTNERS
        </h2>

        {/* Lightweight Partner Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
          {weddingPartners.map((partner) => (
            <div
              key={partner}
              className="inline-flex items-center justify-center rounded-full bg-[#F8F4E8] border border-[#D8C49A]/70 px-5 sm:px-7 py-2.5 sm:py-3 shadow-xs transition-colors duration-200 hover:border-[#D8C49A] hover:bg-[#F2EADA]"
            >
              <span className="text-[11px] sm:text-xs font-manrope font-semibold uppercase tracking-[0.14em] text-[#38382F]">
                {partner}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
