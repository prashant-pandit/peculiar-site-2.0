import React, { useEffect } from "react";
import { Footer, Header } from "../layout";
import WeddingsHero from "./WeddingsHero";
import WeddingStats from "./WeddingStats";
import WeddingGallery from "./WeddingGallery";
import WeddingVideos from "./WeddingVideos";
import WeddingCities from "./WeddingCities";
import WeddingVenues from "./WeddingVenues";
import WeddingPartners from "./WeddingPartners";
import WeddingCTA from "./WeddingCTA";

export default function WeddingsPage() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Weddings | Peculiar Beats";

    let descEl = document.querySelector('meta[name="description"]');
    const prevDesc = descEl ? descEl.getAttribute("content") : "";

    if (descEl) {
      descEl.setAttribute(
        "content",
        "Peculiar Beats wedding experiences, celebrations, venues and events across India."
      );
    }

    window.scrollTo(0, 0);

    return () => {
      document.title = prevTitle;
      if (descEl && prevDesc) {
        descEl.setAttribute("content", prevDesc);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#FFFDF8] text-[#1F1F1A] font-manrope selection:bg-[#D8C49A] selection:text-[#1F1F1A]">
      <Header />
      <main className="w-full">
        <WeddingsHero />
        <WeddingStats />
        <WeddingGallery />
        <WeddingVideos />
        <WeddingCities />
        <WeddingVenues />
        <WeddingPartners />
        <WeddingCTA />
      </main>
      <Footer />
    </div>
  );
}
