"use client";

import { useMemo } from "react";

import Image from "next/image";

import { useNav } from "@/lib/navigation";
import { hotspotPosition, urlFor } from "@/sanity/image";
import type { Project } from "@/sanity/queries";

interface Layer {
  key: string;
  url: string;
  position: string;
  // `fit` slides are contained (letterboxed) within the bounded right region;
  // covers and `full`/`fill` slides are full-bleed cover.
  fit: boolean;
}

// Flatten every project's cover and slides into one ordered image list.
// Keys mirror the active-image keys derived from navigation state.
function buildLayers(projects: Project[]): Layer[] {
  const layers: Layer[] = [];
  projects.forEach((project, pi) => {
    if (project.cover?.asset) {
      layers.push({
        key: `cover-${pi}`,
        url: urlFor(project.cover).url(),
        position: hotspotPosition(project.cover.hotspot),
        fit: false,
      });
    }
    project.slides?.forEach((slide, si) => {
      if (slide.image?.asset) {
        layers.push({
          key: `slide-${pi}-${si}`,
          url: urlFor(slide.image).url(),
          position: hotspotPosition(slide.image.hotspot),
          fit: slide.variant === "fit",
        });
      }
    });
  });
  return layers;
}

// The bounded region a `fit` image is contained within — the inverse of
// FitPanel (right column, inset by the frame edge). Kept in CSS-var terms so
// it tracks the frame token values.
const FIT_REGION = {
  left: "calc(var(--frame-edge) + var(--frame-col-details) + var(--frame-col-list))",
  right: "var(--frame-edge)",
  top: "var(--frame-edge)",
  bottom: "var(--frame-edge)",
} as const;

// Full-bleed cross-fade image stack behind the frame. Every cover and slide
// is rendered once and preloaded; navigation state toggles which one is
// opaque. Sits above the canvas, below the cover overlay and fit panel.
export function VisualLayer({ projects }: { projects: Project[] }) {
  const mode = useNav((s) => s.mode);
  const projectIndex = useNav((s) => s.projectIndex);
  const slideIndex = useNav((s) => s.slideIndex);

  const layers = useMemo(() => buildLayers(projects), [projects]);

  const activeKey =
    mode === "cover"
      ? `cover-${projectIndex}`
      : mode === "slide"
        ? `slide-${projectIndex}-${slideIndex}`
        : null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[1]">
      {layers.map((layer, i) => (
        // Each layer is positioned by an absolute wrapper that carries the
        // cross-fade: full-bleed for cover/`full`/`fill`, or the bounded right
        // region for `fit`. The image fills its wrapper — `object-cover` crops,
        // `object-contain` letterboxes the whole image.
        <div
          key={layer.key}
          className="absolute transition-opacity duration-[var(--duration-base)] ease-standard"
          style={{
            ...(layer.fit ? FIT_REGION : { inset: 0 }),
            opacity: layer.key === activeKey ? 1 : 0,
          }}
        >
          <Image
            src={layer.url}
            alt=""
            fill
            sizes="100vw"
            // 70 (vs the default 75) trims ~10–20% off these full-bleed
            // background images with no visible difference at scale on
            // photographic content (COS-163). 70 is allowlisted in
            // next.config.ts `images.qualities`.
            quality={70}
            priority={i === 0}
            className={
              layer.fit
                ? "object-contain"
                : "object-cover"
            }
            // Hotspot positioning only meaningfully affects cropped (cover)
            // variants; for contain it has negligible effect, so centre it.
            style={{ objectPosition: layer.fit ? "center" : layer.position }}
          />
        </div>
      ))}
    </div>
  );
}
