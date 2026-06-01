"use client";

import { useNav } from "@/lib/navigation";

// Black scrim shown only on the cover state, dimming the cover image so the
// project list reads clearly. Fades out on the slide state. Intro has no cover
// image, so it needs no scrim — its panel is drawn by ProjectOverview.
export function CoverOverlay() {
  const mode = useNav((s) => s.mode);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[2] bg-[var(--cover-overlay)] transition-opacity duration-[var(--duration-base)] ease-standard"
      style={{ opacity: mode === "cover" ? 1 : 0 }}
    />
  );
}
