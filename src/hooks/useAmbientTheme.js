import { useEffect, useState } from "react";

const THEMED_SECTIONS = [
  ["#media", "media"],
  ["#releases", "releases"],
  ["#experience", "experience"],
  ["#booking", "booking"],
];

export function useAmbientTheme() {
  const [ambientTheme, setAmbientTheme] = useState("default");

  useEffect(() => {
    const sections = THEMED_SECTIONS.map(([selector, theme]) => [
      document.querySelector(selector),
      theme,
    ]).filter(([section]) => section);

    let ticking = false;

    const updateAmbientTheme = () => {
      ticking = false;
      const checkpoint = window.innerHeight * 0.42;
      const activeSection = sections.find(([section]) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= checkpoint && bounds.bottom > checkpoint;
      });

      setAmbientTheme(activeSection?.[1] || "default");
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateAmbientTheme);
    };

    updateAmbientTheme();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return ambientTheme;
}
