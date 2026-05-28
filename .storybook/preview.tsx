import type { Decorator, Preview } from "@storybook/nextjs-vite";
import { Schibsted_Grotesk } from "next/font/google";

import { useNav } from "../src/lib/navigation";
import "../src/app/globals.css";

// Mirror the real <html> font setup from src/app/layout.tsx so utilities
// referencing --font-schibsted-grotesk resolve inside Storybook.
const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
  display: "swap",
});

// Canvas toolbar — site renders on a dark canvas by default (FrameShell only
// flips to light on /about, /contact, /writing/*). Stories that only make
// sense on one canvas can pin via `globals: { canvas: "light" }`.
const withCanvas: Decorator = (Story, context) => {
  const canvas = (context.globals.canvas as "dark" | "light") ?? "dark";
  return (
    <div
      data-canvas={canvas}
      className={`${schibstedGrotesk.variable} font-sans`}
      style={{ minHeight: "100vh", padding: "2rem" }}
    >
      <Story />
    </div>
  );
};

// Default useNav store state — manually mirrored from src/lib/navigation.ts.
// Reset between stories so state doesn't leak.
const DEFAULT_NAV_STATE = {
  mode: "stable" as const,
  projectIndex: 0,
  slideIndex: 0,
  articleSlug: null,
  returnTo: null,
  projects: [],
};

// sessionStorage key used by ProjectList for the cold-open reveal.
const PROJECTS_SEEN_KEY = "cos-projects-revealed";

const preview: Preview = {
  decorators: [withCanvas],
  globalTypes: {
    canvas: {
      name: "Canvas",
      description: "Site canvas variant",
      toolbar: {
        title: "Canvas",
        icon: "circlehollow",
        items: [
          { value: "dark", title: "Dark", icon: "circle" },
          { value: "light", title: "Light", icon: "circlehollow" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    canvas: "dark",
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#000000" },
        { name: "light", value: "#edece6" },
      ],
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  async beforeEach() {
    // Reset the navigation store so per-story setState calls start from a
    // clean slate. Methods are stable function references; only state needs
    // resetting.
    useNav.setState(DEFAULT_NAV_STATE);

    // Clear ProjectList's cold-open reveal flag so stories that exercise the
    // unrevealed state behave deterministically.
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(PROJECTS_SEEN_KEY);
    }
  },
};

export default preview;
