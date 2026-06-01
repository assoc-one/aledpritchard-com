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
  // `fill` and `fit` slides are bounded to the right column; covers and `full`
  // slides are full-bleed. Within the bounded region, `fill` cover-crops and
  // `fit` (contain) letterboxes the whole image.
  region: boolean;
  contain: boolean;
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
        region: false,
        contain: false,
      });
    }
    project.slides?.forEach((slide, si) => {
      if (slide.image?.asset) {
        layers.push({
          key: `slide-${pi}-${si}`,
          url: urlFor(slide.image).url(),
          position: hotspotPosition(slide.image.hotspot),
          region: slide.variant === "fill" || slide.variant === "fit",
          contain: slide.variant === "fit",
        });
      }
    });
  });
  return layers;
}

// The bounded right column a `fill`/`fit` image is rendered within — the inverse
// of FitPanel (right column, inset by the frame edge). Kept in CSS-var terms so
// it tracks the frame token values.
const COLUMN_REGION = {
  left: "calc(var(--frame-edge) + var(--frame-col-details) + var(--frame-col-list))",
  right: "var(--frame-edge)",
  top: "var(--frame-edge)",
  bottom: "var(--frame-edge)",
} as const;

// Cross-fade image stack behind the frame. Every cover and slide is rendered
// once and preloaded; navigation state toggles which one is opaque. Sits above
// the canvas, below the cover overlay and fit panel.
export function VisualLayer({ projects }: { projects: Project[] }) {
  const mode = useNav((s) => s.mode);
  const projectIndex = useNav((s) => s.projectIndex);
  const slideIndex = useNav((s) => s.slideIndex);

  const layers = useMemo(() => buildLayers(projects), [projects]);

  // Intro has no backdrop image — the overview renders on the dark canvas with
  // its own panel (see ProjectOverview), so the cover image fades out on the
  // cover → intro step.
  const activeKey =
    mode === "cover"
      ? `cover-${projectIndex}`
      : mode === "slide"
        ? `slide-${projectIndex}-${slideIndex}`
        : null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[1]">
      {layers.map((layer, i) => (
        // An absolute wrapper positions each layer and carries the cross-fade:
        // full-bleed for covers/`full`, or the bounded right column for
        // `fill`/`fit`. Bounding `fill` here (rather than rendering it full-bleed
        // and masking the left with a fading FitPanel) fixes the flash where the
        // image briefly bled left before the mask faded in (COS-204).
        // `object-cover` crops to the column; `object-contain` letterboxes the
        // whole image.
        <div
          key={layer.key}
          className="absolute transition-opacity duration-[var(--duration-base)] ease-standard"
          style={{
            ...(layer.region ? COLUMN_REGION : { inset: 0 }),
            opacity: layer.key === activeKey ? 1 : 0,
          }}
        >
          <Image
            src={layer.url}
            alt=""
            fill
            sizes="100vw"
            // 70 (vs the default 75) trims ~10–20% off these background images
            // with no visible difference at scale on photographic content
            // (COS-163). 70 is allowlisted in next.config.ts `images.qualities`.
            quality={70}
            priority={i === 0}
            className={layer.contain ? "object-contain" : "object-cover"}
            // Hotspot drives the cover crop (covers + `fill`); for contain it
            // has negligible effect, so centre it.
            style={{ objectPosition: layer.contain ? "center" : layer.position }}
          />
        </div>
      ))}
    </div>
  );
}
