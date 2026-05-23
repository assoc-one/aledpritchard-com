import { create } from "zustand";

export type Mode =
  | "stable"
  | "cover"
  | "slide"
  | "menu"
  | "about"
  | "contact"
  | "writing"
  | "article";

// The minimal per-project data the navigation state machine needs. The full
// project content (titles, images) is passed to components as props from the
// server fetch — the store only needs enough to drive navigation.
export interface ProjectMeta {
  slug: string;
  slideCount: number;
}

export interface NavState {
  mode: Mode;
  projectIndex: number;
  slideIndex: number;
  articleSlug: string | null;
  returnTo: Mode | null;

  // Hydrated from the Sanity fetch by FrameShell before any route stub runs.
  projects: ProjectMeta[];
  setProjects: (projects: ProjectMeta[]) => void;

  // Direct jumps (used by page stubs and router sync)
  goHome: () => void;
  goToProject: (index: number) => void;
  goToProjectBySlug: (slug: string) => void;
  goToSlide: (projectIndex: number, slideIndex: number) => void;
  goToSlideBySlug: (slug: string, slideIndex: number) => void;
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

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(n, hi));

export const useNav = create<NavState>((set, get) => ({
  mode: "stable",
  projectIndex: 0,
  slideIndex: 0,
  articleSlug: null,
  returnTo: null,
  projects: [],

  setProjects: (projects) => set({ projects }),

  goHome: () =>
    set({ mode: "stable", projectIndex: 0, slideIndex: 0, articleSlug: null }),

  goToProject: (index) => {
    if (index < 0 || index >= get().projects.length) return;
    set({ mode: "cover", projectIndex: index, slideIndex: 0 });
  },

  goToProjectBySlug: (slug) => {
    const index = get().projects.findIndex((p) => p.slug === slug);
    if (index >= 0) get().goToProject(index);
  },

  goToSlide: (projectIndex, slideIndex) => {
    const { projects } = get();
    if (projectIndex < 0 || projectIndex >= projects.length) return;
    const slides = projects[projectIndex]?.slideCount ?? 0;
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

  goToSlideBySlug: (slug, slideIndex) => {
    const index = get().projects.findIndex((p) => p.slug === slug);
    if (index >= 0) get().goToSlide(index, slideIndex);
  },

  goAbout: () => set({ mode: "about" }),
  goContact: () => set({ mode: "contact" }),
  goWriting: () => set({ mode: "writing", articleSlug: null }),
  openArticle: (slug) => set({ mode: "article", articleSlug: slug }),

  enterSlides: () => {
    const { projectIndex, projects } = get();
    if ((projects[projectIndex]?.slideCount ?? 0) === 0) {
      if (projectIndex < projects.length - 1) {
        get().goToProject(projectIndex + 1);
      }
      return;
    }
    set({ mode: "slide", slideIndex: 0 });
  },

  nextStep: () => {
    const { mode, projectIndex, slideIndex, projects } = get();
    if (mode === "stable") return get().goToProject(0);
    if (mode === "cover") return get().enterSlides();
    if (mode === "slide") {
      const slides = projects[projectIndex]?.slideCount ?? 0;
      if (slideIndex < slides - 1) {
        set({ slideIndex: slideIndex + 1 });
      } else if (projectIndex < projects.length - 1) {
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
    const { mode, projectIndex, projects } = get();
    if (mode === "stable") return get().goToProject(0);
    if (projectIndex < projects.length - 1) get().goToProject(projectIndex + 1);
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

// Debug handle — the navigation store is reachable as `window.__nav`.
// Useful for inspecting state from the console.
if (typeof window !== "undefined") {
  (window as unknown as { __nav: typeof useNav }).__nav = useNav;
}
