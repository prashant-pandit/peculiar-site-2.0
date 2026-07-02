import React from "react";
import { Sparkles } from "lucide-react";
import { experiences } from "../../constants";

export default function ExperiencesSection() {
  return (
    <section className="section-shell" id="experience">
      <h2 className="section-title mb-10 flex items-center gap-3">
        <Sparkles size={30} className="text-primary" aria-hidden="true" />
        Events & Experiences
      </h2>
      <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
        {experiences.map(({ icon: Icon, tone, title, copy }) => (
          <article
            key={title}
            className={`bento-card experience-card experience-card-${tone} p-8`}
          >
            <div className="experience-card-icon mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-surface-container text-primary">
              <Icon size={22} />
            </div>
            <h3 className="font-syne text-2xl font-semibold text-on-surface">
              {title}
            </h3>
            <p className="body-copy mt-4">{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
