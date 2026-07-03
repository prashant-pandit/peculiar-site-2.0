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
    const sections = THEMED_SECTIONS.map(([selector, theme]) => ({
      element: document.querySelector(selector),
      theme,
    })).filter(({ element }) => element);
    let frameId = 0;

    const updateAmbientTheme = () => {
      frameId = 0;
      const checkpoint = window.innerHeight * 0.42;
      const activeSection = sections.find(({ element }) => {
        const bounds = element.getBoundingClientRect();
        return bounds.top <= checkpoint && bounds.bottom > checkpoint;
      });

      const nextTheme = activeSection?.theme || "default";
      setAmbientTheme((currentTheme) =>
        currentTheme === nextTheme ? currentTheme : nextTheme,
      );
    };

    const scheduleAmbientThemeUpdate = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(updateAmbientTheme);
      }
    };

    updateAmbientTheme();
    window.addEventListener("scroll", scheduleAmbientThemeUpdate, {
      passive: true,
    });
    window.addEventListener("resize", scheduleAmbientThemeUpdate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", scheduleAmbientThemeUpdate);
      window.removeEventListener("resize", scheduleAmbientThemeUpdate);
    };
  }, []);

  return ambientTheme;
}
