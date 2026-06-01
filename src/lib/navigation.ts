import { create } from "zustand";

export type Mode =
  | "stable"
  | "cover"
  | "intro"
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
  // True when the project has editorial overview content (T6 `overview.title`).
  // Lets transitions branch into the intro state without drilling project props.
  hasOverview: boolean;
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
  goToIntroBySlug: (slug: string) => void;
  goAbout: () => void;
  goContact: () => void;
  goWriting: () => void;
  openArticle: (slug: string) => void;

  // Relative steps (used by keyboard and wheel)
  enterIntro: () => void;
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

  // Direct-URL entry for /work/[slug]/0. If the project has no overview the
  // intro URL is invalid for it, so land on the cover instead (the route also
  // redirects the URL back to /work/[slug] — see T8).
  goToIntroBySlug: (slug) => {
    const index = get().projects.findIndex((p) => p.slug === slug);
    if (index < 0) return;
    if (!get().projects[index]?.hasOverview) {
      get().goToProject(index);
      return;
    }
    set({ mode: "intro", projectIndex: index, slideIndex: 0 });
  },

  goAbout: () => set({ mode: "about" }),
  goContact: () => set({ mode: "contact" }),
  goWriting: () => set({ mode: "writing", articleSlug: null }),
  openArticle: (slug) => set({ mode: "article", articleSlug: slug }),

  // Relative entry into the intro state for the current project. With no
  // overview there is nothing to show, so fall through into the slides.
  enterIntro: () => {
    const { projectIndex, projects } = get();
    if (!projects[projectIndex]?.hasOverview) {
      return get().enterSlides();
    }
    set({ mode: "intro", slideIndex: 0 });
  },

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
    if (mode === "cover") return get().enterIntro();
    if (mode === "intro") return get().enterSlides();
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
    const { mode, projectIndex, slideIndex, projects } = get();
    if (mode === "slide") {
      if (slideIndex > 0) set({ slideIndex: slideIndex - 1 });
      else if (projects[projectIndex]?.hasOverview) set({ mode: "intro" });
      else set({ mode: "cover" });
      return;
    }
    if (mode === "intro") {
      set({ mode: "cover" });
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
    if (mode === "slide" || mode === "intro" || mode === "cover") {
      set({ mode: "stable" });
    }
  },
}));

// Debug handle — the navigation store is reachable as `window.__nav`.
// Useful for inspecting state from the console.
if (typeof window !== "undefined") {
  (window as unknown as { __nav: typeof useNav }).__nav = useNav;
}
