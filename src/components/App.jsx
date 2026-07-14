import React from "react";
import { useAmbientTheme } from "../hooks";
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
import { WaveformDivider } from "./ui";

export default function App() {
  const ambientTheme = useAmbientTheme();

  return (
    <>
      <Header />
      <main className={`ambient-theme-${ambientTheme}`}>
        <HeroSection />
        <StatsSection />
        <PartnersSection />
        <WaveformDivider />
        <IntroSection />
        <MediaSection />
        <ReleasesSection />
        <WaveformDivider />
        <ExperiencesSection />
        <BookingSection />
      </main>
      <Footer />
    </>
  );
}
