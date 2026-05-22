import { create } from "zustand";

import { TEMP_PROJECTS } from "./_temp-projects";

export type Mode =
  | "stable"
  | "cover"
  | "slide"
  | "menu"
  | "about"
  | "contact"
  | "writing"
  | "article";

export interface NavState {
  mode: Mode;
  projectIndex: number;
  slideIndex: number;
  articleSlug: string | null;
  returnTo: Mode | null;

  // Direct jumps (used by page stubs and router sync)
  goHome: () => void;
  goToProject: (index: number) => void;
  goToSlide: (projectIndex: number, slideIndex: number) => void;
  goAbout: () => void;
  goContact: () => void;
  goWriting: () => void;
  openArticle: (slug: string) => void;

  // Relative steps (used by keyboard and wheel)
  enterSlides: () => void;
  nextStep: () => void;
  prevStep: () => void;
  nextProject: () => void;
  prevProject: () => void;

  // Transient
  toggleMenu: () => void;
  escape: () => void;
}

const COUNT = TEMP_PROJECTS.length;
const slidesOf = (i: number) => TEMP_PROJECTS[i]?.slides ?? 0;
const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(n, hi));

export const useNav = create<NavState>((set, get) => ({
  mode: "stable",
  projectIndex: 0,
  slideIndex: 0,
  articleSlug: null,
  returnTo: null,

  goHome: () =>
    set({ mode: "stable", projectIndex: 0, slideIndex: 0, articleSlug: null }),

  goToProject: (index) => {
    if (index < 0 || index >= COUNT) return;
    set({ mode: "cover", projectIndex: index, slideIndex: 0 });
  },

  goToSlide: (projectIndex, slideIndex) => {
    if (projectIndex < 0 || projectIndex >= COUNT) return;
    const slides = slidesOf(projectIndex);
    if (slides === 0) {
      set({ mode: "cover", projectIndex, slideIndex: 0 });
      return;
    }
    set({
      mode: "slide",
      projectIndex,
      slideIndex: clamp(slideIndex, 0, slides - 1),
    });
  },

  goAbout: () => set({ mode: "about" }),
  goContact: () => set({ mode: "contact" }),
  goWriting: () => set({ mode: "writing", articleSlug: null }),
  openArticle: (slug) => set({ mode: "article", articleSlug: slug }),

  enterSlides: () => {
    const { projectIndex } = get();
    if (slidesOf(projectIndex) === 0) {
      if (projectIndex < COUNT - 1) get().goToProject(projectIndex + 1);
      return;
    }
    set({ mode: "slide", slideIndex: 0 });
  },

  nextStep: () => {
    const { mode, projectIndex, slideIndex } = get();
    if (mode === "stable") return get().goToProject(0);
    if (mode === "cover") return get().enterSlides();
    if (mode === "slide") {
      if (slideIndex < slidesOf(projectIndex) - 1) {
        set({ slideIndex: slideIndex + 1 });
      } else if (projectIndex < COUNT - 1) {
        get().goToProject(projectIndex + 1);
      }
    }
  },

  prevStep: () => {
    const { mode, projectIndex, slideIndex } = get();
    if (mode === "slide") {
      if (slideIndex > 0) set({ slideIndex: slideIndex - 1 });
      else set({ mode: "cover" });
      return;
    }
    if (mode === "cover") {
      if (projectIndex > 0) get().goToProject(projectIndex - 1);
      else set({ mode: "stable" });
    }
  },

  nextProject: () => {
    const { mode, projectIndex } = get();
    if (mode === "stable") return get().goToProject(0);
    if (projectIndex < COUNT - 1) get().goToProject(projectIndex + 1);
  },

  prevProject: () => {
    const { mode, projectIndex } = get();
    if (mode === "stable") return;
    if (projectIndex > 0) get().goToProject(projectIndex - 1);
    else set({ mode: "stable" });
  },

  toggleMenu: () => {
    const { mode, returnTo } = get();
    if (mode === "menu") set({ mode: returnTo ?? "stable", returnTo: null });
    else set({ mode: "menu", returnTo: mode });
  },

  escape: () => {
    const { mode } = get();
    if (mode === "menu") return get().toggleMenu();
    if (mode === "about" || mode === "contact" || mode === "writing") {
      return get().goHome();
    }
    if (mode === "article") {
      set({ mode: "writing", articleSlug: null });
      return;
    }
    if (mode === "slide" || mode === "cover") set({ mode: "stable" });
  },
}));

// Debug handle — the navigation store is also reachable as `window.__nav`,
// consistent with the /test/nav debug route. Useful for inspecting state.
if (typeof window !== "undefined") {
  (window as unknown as { __nav: typeof useNav }).__nav = useNav;
}
