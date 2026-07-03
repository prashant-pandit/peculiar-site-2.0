import React from "react";
import { stats } from "../../constants";

export default function StatsSection() {
  return (
    <section className="render-deferred border-y border-outline-variant/20 bg-surface-container-low py-16">
      <div className="mx-auto grid max-w-container-max grid-cols-2 gap-8 px-margin-mobile text-center md:grid-cols-4 md:px-margin-desktop">
        {stats.map(([value, label]) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <span className="font-syne text-4xl font-bold text-primary-container md:text-5xl">
              {value}
            </span>
            <span className="label-caps text-on-surface-variant">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
