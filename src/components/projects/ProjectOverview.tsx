"use client";

import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";

import { useNav } from "@/lib/navigation";
import type { Project } from "@/sanity/queries";

// Body renderer for the intro overview — paragraphs only (the schema allows no
// headings/lists), sized for the dark intro panel. Distinct from the article
// PortableBody, which is tuned for the light writing canvas. Matches Figma
// 119:3165: 12px / 1.4, 70% white.
const bodyComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-[12px] leading-[1.4] text-text-white-70 canvas-light:text-text-dark-70">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-medium text-text-white canvas-light:text-text-dark">
        {children}
      </strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

// Editorial overview shown in the right flex column when the navigation mode is
// `intro` (between cover and first slide). Renders over the cover backdrop.
// Hidden — and inert — in every other mode and for projects without overview
// content. Matches Figma 119:3165.
export function ProjectOverview({ projects }: { projects: Project[] }) {
  const mode = useNav((s) => s.mode);
  const projectIndex = useNav((s) => s.projectIndex);

  const overview = projects[projectIndex]?.overview;
  const active = mode === "intro" && Boolean(overview?.title);

  return (
    <div
      aria-hidden={!active}
      className={`flex h-full items-center justify-center px-[var(--frame-edge)] transition-opacity duration-[var(--duration-base)] ease-standard ${
        active
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      {overview?.title ? (
        <div className="flex w-full max-w-[520px] flex-col gap-[64px]">
          {/* Header: title, subtitle, and the label/value meta strip. */}
          <div className="flex flex-col gap-[32px]">
            <div className="flex flex-col gap-[8px]">
              <h1 className="text-[22px] leading-[1.1] tracking-[-0.01em] text-text-white canvas-light:text-text-dark">
                {overview.title}
              </h1>
              {overview.subtitle ? (
                <p className="text-[12px] leading-[1.4] text-text-white-70 canvas-light:text-text-dark-70">
                  {overview.subtitle}
                </p>
              ) : null}
            </div>

            {overview.meta && overview.meta.length > 0 ? (
              <dl className="m-0 flex flex-wrap gap-[32px] border-y border-white/10 py-[32px] text-[12px]">
                {overview.meta.map((item, i) => (
                  <div key={i} className="flex flex-col">
                    <dt className="leading-[1.4] text-text-white-70 canvas-light:text-text-dark-70">
                      {item.label}
                    </dt>
                    <dd className="m-0 leading-[24px] text-text-white canvas-light:text-text-dark">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>

          {/* Body: short paragraphs of portable text. */}
          {overview.body && overview.body.length > 0 ? (
            <div className="flex flex-col gap-[12px]">
              <PortableText
                value={overview.body as PortableTextBlock[]}
                components={bodyComponents}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
