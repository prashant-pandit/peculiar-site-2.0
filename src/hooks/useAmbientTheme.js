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
    const updateAmbientTheme = () => {
      const checkpoint = window.innerHeight * 0.42;
      const activeSection = THEMED_SECTIONS.find(([selector]) => {
        const section = document.querySelector(selector);
        if (!section) return false;

        const bounds = section.getBoundingClientRect();
        return bounds.top <= checkpoint && bounds.bottom > checkpoint;
      });

      setAmbientTheme(activeSection?.[1] || "default");
    };

    updateAmbientTheme();
    window.addEventListener("scroll", updateAmbientTheme, { passive: true });
    window.addEventListener("resize", updateAmbientTheme);

    return () => {
      window.removeEventListener("scroll", updateAmbientTheme);
      window.removeEventListener("resize", updateAmbientTheme);
    };
  }, []);

  return ambientTheme;
}
