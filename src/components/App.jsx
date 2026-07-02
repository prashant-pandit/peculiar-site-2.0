import React from "react";
import { useAmbientTheme } from "../hooks";
import { AnimatedWaveBackground } from "./background";
import { Footer, Header } from "./layout";
import {
  BookingSection,
  ExperiencesSection,
  HeroSection,
  IntroSection,
  MediaSection,
  PartnersSection,
  ReleasesSection,
  StatsSection,
} from "./sections";

export default function App() {
  const ambientTheme = useAmbientTheme();

  return (
    <>
      <AnimatedWaveBackground />
      <Header />
      <main className={`ambient-theme-${ambientTheme}`}>
        <HeroSection />
        <StatsSection />
        <PartnersSection />
        <IntroSection />
        <MediaSection />
        <ReleasesSection />
        <ExperiencesSection />
        <BookingSection />
      </main>
      <Footer />
    </>
  );
}
