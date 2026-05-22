"use client";

import { useNav } from "@/lib/navigation";

const pad = (n: number) => String(n + 1).padStart(2, "0");

// The index numbers shown inside IndexSlot. Visible only in a project
// context. On the slide state the slide number fades in at the right edge
// and the project number shifts left to sit beside it.
export function IndexCounter() {
  const mode = useNav((s) => s.mode);
  const projectIndex = useNav((s) => s.projectIndex);
  const slideIndex = useNav((s) => s.slideIndex);

  const visible = mode === "cover" || mode === "slide";
  const hasSlide = mode === "slide";

  return (
    <div
      className="relative h-[22px] w-[100px] transition-opacity duration-[var(--duration-base)] ease-standard"
      style={{ opacity: visible ? 1 : 0 }}
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
