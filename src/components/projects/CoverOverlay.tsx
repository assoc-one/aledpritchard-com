"use client";

import { useNav } from "@/lib/navigation";

// Black scrim shown on the cover and intro states, dimming the cover image so
// the project list and overview text read clearly. Fades out on the slide
// state. Persisting it through intro keeps the backdrop continuous from
// cover → intro.
export function CoverOverlay() {
  const mode = useNav((s) => s.mode);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[2] bg-[var(--cover-overlay)] transition-opacity duration-[var(--duration-base)] ease-standard"
      style={{ opacity: mode === "cover" || mode === "intro" ? 1 : 0 }}
    />
  );
}
