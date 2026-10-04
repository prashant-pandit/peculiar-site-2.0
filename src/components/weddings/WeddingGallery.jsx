import React from "react";
import { weddingGallery } from "../../constants/weddings.data";

export default function WeddingGallery() {
  const row1 = weddingGallery.slice(0, 2);
  const row2 = weddingGallery.slice(2, 4);

  return (
    <section className="w-full bg-[#FFFDF8] py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 md:px-16">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14">
          <span className="block text-[11px] sm:text-xs font-manrope font-semibold uppercase tracking-[0.22em] text-[#7A786B] mb-2">
            EDITORIAL ARCHIVE
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-normal text-[#1F1F1A] tracking-tight">
            THE WEDDINGS
          </h2>
        </div>

        {/* Asymmetrical Gallery Composition */}
        <div className="flex flex-col gap-6 md:gap-8">
          {/* Row 1: Large left (~62%), Smaller right (~38%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {row1.map((item) => (
              <div
                key={item.id}
                className={`${item.colSpan} ${item.rowHeight} relative group overflow-hidden rounded-xl border border-[#E4DAC8]/60 bg-[#F8F4E8] shadow-sm`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Frosted bottom label pill */}
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-1.5 backdrop-blur-md border border-[#E4DAC8] shadow-sm transition group-hover:bg-white/95">
                    <span className="text-[10px] sm:text-[11px] font-manrope font-semibold uppercase tracking-[0.14em] text-[#1F1F1A]">
                      {item.tag}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: Smaller left (~38%), Large horizontal right (~62%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {row2.map((item) => (
              <div
                key={item.id}
                className={`${item.colSpan} ${item.rowHeight} relative group overflow-hidden rounded-xl border border-[#E4DAC8]/60 bg-[#F8F4E8] shadow-sm`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Frosted bottom label pill */}
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-1.5 backdrop-blur-md border border-[#E4DAC8] shadow-sm transition group-hover:bg-white/95">
                    <span className="text-[10px] sm:text-[11px] font-manrope font-semibold uppercase tracking-[0.14em] text-[#1F1F1A]">
                      {item.tag}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
