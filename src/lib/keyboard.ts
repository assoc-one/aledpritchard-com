import { useEffect } from "react";

import { useNav } from "./navigation";

// Global keyboard navigation — ported from the v4 prototype.
// Arrows act only in stable/cover/slide; M and Esc act in every mode.
// Disabled while an input or textarea is focused.
export function useKeyboard() {
  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      const target = e.target;
      if (target instanceof HTMLElement && target.matches("input, textarea")) {
        return;
      }

      const nav = useNav.getState();
      const key = e.key;

      if (key === "Escape") {
        nav.escape();
        e.preventDefault();
        return;
      }
      if (key.toLowerCase() === "m") {
        nav.toggleMenu();
        e.preventDefault();
        return;
      }

      // Arrows are inert in menu / inner-page / article modes.
      if (
        nav.mode === "menu" ||
        nav.mode === "about" ||
        nav.mode === "contact" ||
        nav.mode === "writing" ||
        nav.mode === "article"
      ) {
        return;
      }

      if (key === "ArrowDown") {
        nav.nextProject();
        e.preventDefault();
      } else if (key === "ArrowUp") {
        nav.prevProject();
        e.preventDefault();
      } else if (key === "ArrowRight") {
        nav.nextStep();
        e.preventDefault();
      } else if (key === "ArrowLeft") {
        nav.prevStep();
        e.preventDefault();
      }
    }

    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, []);
}
