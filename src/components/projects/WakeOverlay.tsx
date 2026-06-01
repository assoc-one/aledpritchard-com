"use client";

import { useNav } from "@/lib/navigation";

// Frame hover-wake scrim (COS-194). On `full`-variant slides, hovering any
// frame hit-target sets `frameWake`, fading in the same cover scrim used on the
// cover state so the full-bleed image dims and the frame/nav labels gain
// contrast. `frameWake` is gated to full slides at the source and reset on
// every navigation transition, so opacity can key off it directly. Fades at
// --duration-fast (200ms) — quicker than the cover scrim's base timing. Shares
// the cover scrim's z-[2] band (above the image, below content/chrome); never
// shown at the same time as the cover scrim, which is cover-state only.
export function WakeOverlay() {
  const frameWake = useNav((s) => s.frameWake);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[2] bg-[var(--cover-overlay)] transition-opacity duration-[var(--duration-fast)] ease-standard"
      style={{ opacity: frameWake ? 1 : 0 }}
    />
  );
}
