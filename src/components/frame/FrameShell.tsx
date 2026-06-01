"use client";

import { useMemo } from "react";

import { usePathname } from "next/navigation";

import { CoverOverlay } from "@/components/projects/CoverOverlay";
import { FitPanel } from "@/components/projects/FitPanel";
import { VisualLayer } from "@/components/projects/VisualLayer";
import { useKeyboard } from "@/lib/keyboard";
import { useNav } from "@/lib/navigation";
import { useRouterSync } from "@/lib/routerSync";
import { useWheel } from "@/lib/wheel";
import type { Project } from "@/sanity/queries";

import { Frame } from "./Frame";

// Routes that render on the light (cream) canvas. Canvas stays route-derived
// for SSR-correct, flash-free first paint; routerSync keeps the URL in step
// with the navigation store, so this matches the store's mode in practice.
function isLightRoute(pathname: string): boolean {
  return (
    pathname === "/about" ||
    pathname === "/contact" ||
    pathname.startsWith("/writing")
  );
}

// Client half of the frame layout. The server layout fetches the projects
// and hands them here; this component hydrates the navigation store, mounts
// the navigation behaviours, and renders the persistent project UI.
export function FrameShell({
  projects,
  tagline,
  children,
}: {
  projects: Project[];
  tagline: string;
  children: React.ReactNode;
}) {
  // Hydrate the store with the project manifest before any child route stub
  // runs its mount effects. Done in render (children render after this), and
  // idempotent — once set, the store holds the same reference and is skipped.
  const manifest = useMemo(
    () =>
      projects.map((project) => ({
        slug: project.slug ?? "",
        slideCount: project.slides?.length ?? 0,
        hasOverview: Boolean(project.overview?.title),
      })),
    [projects],
  );
  if (useNav.getState().projects !== manifest) {
    useNav.getState().setProjects(manifest);
  }

  const pathname = usePathname();
  const mode = useNav((s) => s.mode);

  // Navigation behaviours — mounted once, run on every route in the group.
  useRouterSync();
  useKeyboard();
  useWheel();

  // The menu overlay is red — force the dark-canvas label colours while it is
  // open so the frame labels stay legible on top of it.
  const canvas =
    mode === "menu" || !isLightRoute(pathname) ? "dark" : "light";

  return (
    <div data-canvas={canvas}>
      <VisualLayer projects={projects} />
      <CoverOverlay />
      <FitPanel projects={projects} />
      <Frame projects={projects} tagline={tagline}>
        {children}
      </Frame>
    </div>
  );
}
