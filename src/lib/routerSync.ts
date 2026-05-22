import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { type NavState, useNav } from "./navigation";

// Store state -> URL path. Returns null for transient modes (menu) that
// must not change the URL.
function pathForState(s: NavState): string | null {
  switch (s.mode) {
    case "stable":
      return "/";
    case "cover":
      return `/work/${s.projects[s.projectIndex]?.slug ?? ""}`;
    case "slide":
      return `/work/${s.projects[s.projectIndex]?.slug ?? ""}/${s.slideIndex + 1}`;
    case "about":
      return "/about";
    case "contact":
      return "/contact";
    case "cv":
      return "/cv";
    case "writing":
      return "/writing";
    case "article":
      return s.articleSlug ? `/writing/${s.articleSlug}` : "/writing";
    case "menu":
      return null;
  }
}

// URL path -> store. Used for browser back/forward (popstate).
function applyPath(path: string) {
  const nav = useNav.getState();
  if (path === "/" || path === "") return nav.goHome();
  if (path === "/about") return nav.goAbout();
  if (path === "/contact") return nav.goContact();
  if (path === "/cv") return nav.goCv();
  if (path === "/writing") return nav.goWriting();

  const work = path.match(/^\/work\/([^/]+)(?:\/(\d+))?$/);
  if (work) {
    if (work[2]) nav.goToSlideBySlug(work[1], parseInt(work[2], 10) - 1);
    else nav.goToProjectBySlug(work[1]);
    return;
  }

  const article = path.match(/^\/writing\/([^/]+)$/);
  if (article) nav.openArticle(article[1]);
}

// Keeps the Zustand store and the Next.js URL in sync, both directions.
// Mounted once in the frame layout so it runs on every route.
export function useRouterSync() {
  const router = useRouter();

  useEffect(() => {
    // The last path we synced. This is the loop guard: a route change remounts
    // a page stub that re-sets the same state, which must NOT re-push.
    // window.location.pathname is unreliable mid-transition, so we track it
    // ourselves.
    let lastPath = window.location.pathname;

    const unsubscribe = useNav.subscribe((state) => {
      const path = pathForState(state);
      if (path && path !== lastPath) {
        lastPath = path;
        router.push(path, { scroll: false });
      }
    });

    const onPopState = () => {
      lastPath = window.location.pathname;
      applyPath(window.location.pathname);
    };
    window.addEventListener("popstate", onPopState);

    return () => {
      unsubscribe();
      window.removeEventListener("popstate", onPopState);
    };
  }, [router]);
}
