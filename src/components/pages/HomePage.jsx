import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  BookingSection,
  ExperiencesSection,
  HeroSection,
  IntroSection,
  MediaSection,
  PartnersSection,
  ReleasesSection,
  StatsSection,
} from "../sections";
import { WaveformDivider } from "../ui";

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <>
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
    </>
  );
}
