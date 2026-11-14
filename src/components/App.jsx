import React from "react";
import { useAmbientTheme, useRouter } from "../hooks";
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
import { WeddingsPage } from "./weddings";

export default function App() {
  const { isWeddings } = useRouter();
  const ambientTheme = useAmbientTheme();

  if (isWeddings) {
    return <WeddingsPage />;
  }

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
