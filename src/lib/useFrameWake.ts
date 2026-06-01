"use client";

import { useNav } from "@/lib/navigation";
import type { Project } from "@/sanity/queries";

// True only on devices with a real hover-capable pointer. Touch taps can
// synthesize `mouseenter`, so wake is gated on this to keep touch devices from
// ever triggering it (COS-194 requirement).
function canHover(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: hover)").matches
  );
}

// Shared hover handlers for the five frame hit-targets (the three FrameDetails
// labels, the project list column, and the index counter). Wake is scoped to
// `mode === 'slide'` with the active slide on the `full` variant — resolved the
// same way FitPanel reads it, from the projects passed down. On every other
// state the handlers are inert. The wake visual itself is read separately via
// `useNav((s) => s.frameWake)`; this hook only owns the trigger.
export function useFrameWake(projects: Project[]) {
  const mode = useNav((s) => s.mode);
  const projectIndex = useNav((s) => s.projectIndex);
  const slideIndex = useNav((s) => s.slideIndex);
  const setFrameWake = useNav((s) => s.setFrameWake);

  const variant =
    mode === "slide"
      ? projects[projectIndex]?.slides?.[slideIndex]?.variant
      : null;
  const wakeable = mode === "slide" && variant === "full";

  return {
    wakeable,
    onMouseEnter: () => {
      if (wakeable && canHover()) setFrameWake(true);
    },
    onMouseLeave: () => setFrameWake(false),
  };
}
