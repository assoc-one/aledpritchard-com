import { useEffect } from "react";

import { useNav } from "./navigation";

const SCROLL_STEP = 20;
const RESET_MS = 180;

// True while a wheel gesture is actively driving navigation. COS-140's list
// column reads this to choose instant vs. smooth scroll-to-active.
let wheelDrivenNav = false;
export function isWheelDrivenNav(): boolean {
  return wheelDrivenNav;
}

// Continuous wheel scroll over the list column — ported from the v4 prototype.
// Accumulates deltaY; each 20px crossed steps one project.
export function useWheel() {
  useEffect(() => {
    let acc = 0;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;

    function onWheel(e: WheelEvent) {
      const nav = useNav.getState();
      if (
        nav.mode === "menu" ||
        nav.mode === "about" ||
        nav.mode === "contact" ||
        nav.mode === "writing" ||
        nav.mode === "article"
      ) {
        return;
      }

      const target = e.target;
      if (!(target instanceof Element) || !target.closest(".frame-list-column")) {
        return;
      }

      e.preventDefault();
      acc += e.deltaY;
      wheelDrivenNav = true;

      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        acc = 0;
        wheelDrivenNav = false;
      }, RESET_MS);

      while (Math.abs(acc) >= SCROLL_STEP) {
        if (acc > 0) {
          nav.nextProject();
          acc -= SCROLL_STEP;
        } else {
          nav.prevProject();
          acc += SCROLL_STEP;
        }
      }
    }

    document.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      document.removeEventListener("wheel", onWheel);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, []);
}
