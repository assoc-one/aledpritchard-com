"use client";

import { useEffect, useRef } from "react";

import { useNav } from "@/lib/navigation";
import { useFrameWake } from "@/lib/useFrameWake";
import { isWheelDrivenNav } from "@/lib/wheel";
import type { Project } from "@/sanity/queries";

// On every full page load the list items reveal with a staggered slide-up. The
// entrance is CSS-driven (`.list-item-reveal` in globals.css) so the titles are
// painted at first paint rather than held hidden behind JS hydration — that
// keeps them eligible as the LCP element. Client-side navigation back to home
// keeps them in place without re-animating, because the frame layout (and this
// component) persists across in-app navigation, so the keyframe only runs on
// the initial mount (ported from the v4 prototype).
const STAGGER_STEP = 120;

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
  // The list column is one of the five frame hover-wake hit-targets (COS-194).
  const { onMouseEnter, onMouseLeave } = useFrameWake(projects);

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
    if (mode === "cover" || mode === "slide" || mode === "intro") {
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

  const isProjectMode =
    mode === "cover" || mode === "slide" || mode === "intro";
  // The list belongs to the project context only — hidden on the menu and
  // inner pages.
  const listVisible = mode === "stable" || isProjectMode;

  function handleClick(index: number) {
    if (mode === "cover" && projectIndex === index) enterSlides();
    else goToProject(index);
  }

  // `inert` keeps the off-screen list and its buttons out of focus/screen-reader
  // order when they're visually hidden behind the menu or an inner page.
  const interactive = listVisible;

  return (
    <div
      inert={!interactive}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
            className={`list-item-reveal w-[280px] truncate text-left transition-colors duration-[var(--duration-base)] ease-standard ${
              isActive
                ? "text-text-white"
                : "text-text-white-40 hover:text-text-white-70"
            }`}
            style={{ animationDelay: `${index * STAGGER_STEP}ms` }}
          >
            {project.title}
          </button>
        );
      })}
    </div>
  );
}
