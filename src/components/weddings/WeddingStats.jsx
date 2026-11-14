import React from "react";
import { weddingStats } from "../../constants/weddings.data";

export default function WeddingStats() {
  return (
    <section className="w-full bg-[#F8F4E8] border-b border-[#E4DAC8]">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 md:px-16 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0">
          {weddingStats.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center justify-center text-center px-4 ${
                index % 2 === 0
                  ? "border-r border-[#E4DAC8] md:border-r"
                  : index !== weddingStats.length - 1
                  ? "md:border-r md:border-[#E4DAC8]"
                  : ""
              }`}
            >
              <div className="font-playfair text-3xl sm:text-4xl md:text-5xl font-normal text-[#1F1F1A] tracking-tight">
                {stat.value}
              </div>
              <div className="mt-2 text-[10px] sm:text-[11px] font-manrope font-semibold uppercase tracking-[0.16em] text-[#7A786B] max-w-[140px] leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
