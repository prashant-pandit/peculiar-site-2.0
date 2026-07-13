import React from "react";
import { Mic2 } from "lucide-react";
import { images } from "../../constants";

export default function IntroSection() {
  return (
    <section className="section-shell">
      <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-surface-container">
            <img
              src={images.portrait}
              alt="Peculiar Beats DJ performing at a club event in Karnataka"
              className="h-full w-full object-cover grayscale transition duration-700 group-hover:grayscale-0"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
          </div>
        </div>
        <div className="flex flex-col justify-center md:col-span-7 md:pl-12">
          <div className="mb-6 inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary-container" />
            <span className="label-caps text-primary">The Architect of Sound</span>
          </div>
          <h2 className="section-title flex w-full max-w-3xl flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
            <Mic2 size={30} className="text-primary" aria-hidden="true" />
            INTRO
          </h2>
          <p className="body-copy mt-6 max-w-2xl text-lg">
            Peculiar Beats — the DJ who turns every event into a
            full-blown vibe. Whether it&apos;s Bollywood hits, Techno grooves, or
            Regional fire, I mix it all with a twist that keeps people locked to
            the dancefloor. I&apos;ve rocked 600+ events across multiple states and
            cities, and 100+ venues — from weddings and clubs to big concerts
            with celeb DJs. My goal? Simple. Keep the floor packed, and the
            energy unmatched.
          </p>
          <p className="body-copy mt-5 max-w-2xl">
            Weddings, club nights, house parties, or corporate shows — I&apos;ve done
            it all, and I bring the vibe every time. From throwback Bollywood to
            techno heaters and my signature Bollytech mashups, I build each set
            to match the crowd, the mood, and the moment. No copy-paste
            playlists here — just pure energy, emotion, and music that hits
            where it should.
          </p>
        </div>
      </div>
    </section>
  );
}
