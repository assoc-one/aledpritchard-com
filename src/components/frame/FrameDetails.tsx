"use client";

import { useNav } from "@/lib/navigation";
import { useFrameWake } from "@/lib/useFrameWake";
import type { Project } from "@/sanity/queries";

// Column 1 of the frame: role, name, and the menu toggle. Each label is one of
// the five frame hover-wake hit-targets (COS-194) — hovering any of them on a
// full slide fades in the wake scrim. The labels' own appearance is unchanged.
export function FrameDetails({ projects = [] }: { projects?: Project[] }) {
  const { onMouseEnter, onMouseLeave } = useFrameWake(projects);
  const wake = { onMouseEnter, onMouseLeave };

  return (
    <div className="pointer-events-auto relative h-screen">
      <span
        {...wake}
        className="absolute left-[var(--frame-edge)] top-[var(--frame-edge)] text-text-white-70 transition-colors duration-[var(--duration-base)] ease-standard canvas-light:text-text-dark-70"
      >
        Design Director
      </span>
      <span
        {...wake}
        className="absolute left-[var(--frame-edge)] top-[50vh] -translate-y-1/2 text-text-white transition-colors duration-[var(--duration-base)] ease-standard canvas-light:text-text-dark"
      >
        Aled Pritchard
      </span>
      <button
        {...wake}
        type="button"
        onClick={() => useNav.getState().toggleMenu()}
        className="absolute bottom-[var(--frame-edge)] left-[var(--frame-edge)] text-text-white-70 transition-colors duration-[var(--duration-fast)] ease-out hover:text-text-white canvas-light:text-text-dark-70 canvas-light:hover:text-text-dark"
      >
        Menu
      </button>
    </div>
  );
}
