import React from "react";
import { Handshake } from "lucide-react";
import { partnerLogos } from "../../constants";

export default function PartnersSection() {
  return (
    <section className="overflow-hidden bg-background py-28">
      <h2 className="label-caps mb-12 flex items-center justify-center gap-2 text-center text-on-surface-variant/60">
        <Handshake size={16} className="text-primary" aria-hidden="true" />
        Brands That Chose Peculiar Beats
      </h2>
      <div className="marquee-track">
        {[0, 1].map((group) => (
          <div className="marquee-row" key={group}>
            {partnerLogos.map(([name, src]) => (
              <img
                key={`${group}-${name}`}
                src={src}
                alt={`${name} logo`}
                className="partner-logo"
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
