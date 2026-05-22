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
      });
    }
    project.slides?.forEach((slide, si) => {
      if (slide.image?.asset) {
        layers.push({
          key: `slide-${pi}-${si}`,
          url: urlFor(slide.image).url(),
          position: hotspotPosition(slide.image.hotspot),
        });
      }
    });
  });
  return layers;
}

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
        <Image
          key={layer.key}
          src={layer.url}
          alt=""
          fill
          sizes="100vw"
          priority={i === 0}
          className="object-cover transition-opacity duration-[var(--duration-base)] ease-standard"
          style={{
            objectPosition: layer.position,
            opacity: layer.key === activeKey ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
}
