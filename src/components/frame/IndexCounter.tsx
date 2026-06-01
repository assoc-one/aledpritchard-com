"use client";

import { useNav } from "@/lib/navigation";
import { useFrameWake } from "@/lib/useFrameWake";
import type { Project } from "@/sanity/queries";

const pad = (n: number) => String(n + 1).padStart(2, "0");

// The index numbers shown inside IndexSlot. Visible only in a project
// context. On the slide state the slide number fades in at the right edge
// and the project number shifts left to sit beside it. Also one of the five
// frame hover-wake hit-targets (COS-194) — pointer events are re-enabled here
// (IndexSlot itself is pointer-events-none) only while the counter is visible.
export function IndexCounter({ projects = [] }: { projects?: Project[] }) {
  const mode = useNav((s) => s.mode);
  const projectIndex = useNav((s) => s.projectIndex);
  const slideIndex = useNav((s) => s.slideIndex);
  const { onMouseEnter, onMouseLeave } = useFrameWake(projects);

  const visible = mode === "cover" || mode === "slide" || mode === "intro";
  // Intro is "slide 0": show both numbers (project + slide) like the slide
  // state, so the counter reads e.g. "01 01" on the overview.
  const hasSlide = mode === "slide" || mode === "intro";

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative h-[22px] w-[100px] transition-opacity duration-[var(--duration-base)] ease-standard"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <span
        className="absolute right-0 top-0 transition-transform duration-[var(--duration-base)] ease-standard"
        style={{ transform: hasSlide ? "translateX(-32px)" : "translateX(0)" }}
      >
        {pad(projectIndex)}
      </span>
      <span
        className="absolute right-0 top-0 transition-opacity duration-[var(--duration-base)] ease-standard"
        style={{ opacity: hasSlide ? 1 : 0 }}
      >
        {pad(slideIndex)}
      </span>
    </div>
  );
}
