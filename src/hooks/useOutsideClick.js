import { useEffect } from "react";

export function useOutsideClick(ref, onOutsideClick) {
  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!ref.current?.contains(event.target)) {
        onOutsideClick();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [ref, onOutsideClick]);
}
