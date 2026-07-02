import { useEffect, useState } from "react";

export function useViewportWidth(defaultWidth = 1200) {
  const [viewportWidth, setViewportWidth] = useState(
    typeof window === "undefined" ? defaultWidth : window.innerWidth,
  );

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);

    onResize();
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  return viewportWidth;
}
