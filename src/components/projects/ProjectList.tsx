"use client";

import { useEffect, useRef, useState } from "react";

import { useNav } from "@/lib/navigation";
import { isWheelDrivenNav } from "@/lib/wheel";
import type { Project } from "@/sanity/queries";

// On every full page load (initial or reload/refresh) the list items reveal
// with a stagger; client-side navigation back to home keeps them visible
// without re-animating, because the frame layout — and this component's
// `revealed` state — persists across in-app navigation (ported from the v4
// prototype).
const REVEAL_DELAY = 1200;
const STAGGER_STEP = 60;

export function ProjectList({
  projects,
  tagline,
}: {
  projects: Project[];
  tagline: string;
}) {
  const mode = useNav((s) => s.mode);
  const projectIndex = useNav((s) => s.projectIndex);
  const goToProject = useNav((s) => s.goToProject);
  const enterSlides = useNav((s) => s.enterSlides);

  // Cold-open reveal — `revealed` keeps items visible in the stable state for
  // the rest of the session; `staggered` applies the one-time entrance delay.
  const [revealed, setRevealed] = useState(false);
  const [staggered, setStaggered] = useState(false);

  useEffect(() => {
    const reveal = setTimeout(() => {
      setRevealed(true);
      setStaggered(true);
    }, REVEAL_DELAY);
    const settle = setTimeout(() => setStaggered(false), REVEAL_DELAY + 1400);
    return () => {
      clearTimeout(reveal);
      clearTimeout(settle);
    };
  }, []);

  // Keep the active project (or, in the stable state, the tagline) centred in
  // the scroll column. Wheel-driven navigation jumps instantly; clicks and
  // keys animate.
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const column = document.querySelector<HTMLElement>(".frame-list-column");
    if (!column) return;
    const behavior: ScrollBehavior = isWheelDrivenNav() ? "auto" : "smooth";

    if (mode === "stable") {
      column.scrollTo({ top: 0, behavior });
      return;
    }
    if (mode === "cover" || mode === "slide") {
      const item = itemRefs.current[projectIndex];
      if (!item) return;
      const columnRect = column.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const delta =
        itemRect.top +
        itemRect.height / 2 -
        (columnRect.top + columnRect.height / 2);
      if (Math.abs(delta) > 1) column.scrollBy({ top: delta, behavior });
    }
  }, [mode, projectIndex]);

  const isProjectMode = mode === "cover" || mode === "slide";
  // The list belongs to the project context only — hidden on the menu and
  // inner pages. Items additionally stay hidden in the stable state until
  // the cold-open reveal.
  const listVisible = mode === "stable" || isProjectMode;
  const itemsShown = isProjectMode || (mode === "stable" && revealed);

  function handleClick(index: number) {
    if (mode === "cover" && projectIndex === index) enterSlides();
    else goToProject(index);
  }

  // `inert` keeps the off-screen list and its buttons out of focus/screen-reader
  // order when they're visually hidden behind the menu or an inner page, and
  // during the cold-open reveal delay.
  const interactive = listVisible && itemsShown;

  return (
    <div
      inert={!interactive}
      className="flex flex-col gap-[5px] py-[calc(50vh-11px)] pr-[var(--frame-edge)] transition-opacity duration-[var(--duration-base)] ease-standard"
      style={{
        opacity: listVisible ? 1 : 0,
        pointerEvents: listVisible ? undefined : "none",
      }}
    >
      <p
        className={`mb-[5px] max-w-[280px] transition-colors duration-[var(--duration-base)] ease-standard ${
          isProjectMode ? "text-text-white-40" : "text-text-white"
        }`}
      >
        {tagline}
      </p>

      {projects.map((project, index) => {
        const isActive = isProjectMode && index === projectIndex;
        return (
          <button
            key={project._id}
            type="button"
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            onClick={() => handleClick(index)}
            className={`w-[280px] truncate text-left transition-[opacity,color] ease-standard ${
              isActive
                ? "text-text-white"
                : "text-text-white-40 hover:text-text-white-70"
            }`}
            style={{
              opacity: itemsShown ? 1 : 0,
              pointerEvents: itemsShown ? "auto" : "none",
              transitionDuration: staggered ? "800ms" : "var(--duration-base)",
              transitionDelay: staggered ? `${index * STAGGER_STEP}ms` : "0ms",
            }}
          >
            {project.title}
          </button>
        );
      })}
    </div>
  );
}
