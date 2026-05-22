"use client";

import { useNav } from "@/lib/navigation";
import type { Project } from "@/sanity/queries";

// Solid panel covering the left two columns (details + list) when the active
// slide is the `fit` variant, so the slide image reads as bounded to the
// right column rather than full-bleed.
export function FitPanel({ projects }: { projects: Project[] }) {
  const mode = useNav((s) => s.mode);
  const projectIndex = useNav((s) => s.projectIndex);
  const slideIndex = useNav((s) => s.slideIndex);

  const variant =
    mode === "slide"
      ? projects[projectIndex]?.slides?.[slideIndex]?.variant
      : null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-y-0 left-0 z-[3] w-[calc(var(--frame-col-details)+var(--frame-col-list))] bg-canvas-dark transition-opacity duration-[var(--duration-base)] ease-standard"
      style={{ opacity: variant === "fit" ? 1 : 0 }}
    />
  );
}
