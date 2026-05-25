import type { Decorator, Preview } from "@storybook/nextjs-vite";
import { Schibsted_Grotesk } from "next/font/google";

import "../src/app/globals.css";

// Mirror the real <html> font setup from src/app/layout.tsx so utilities
// referencing --font-schibsted-grotesk resolve inside Storybook.
const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
  display: "swap",
});

// The site renders on a dark canvas by default (FrameShell.tsx only flips to
// light on /about, /contact, /writing/*). Wrap every story in a dark canvas
// so canvas-aware utilities resolve the same way they do in the app.
// A toolbar to toggle this comes later (COS-156).
const withCanvas: Decorator = (Story) => (
  <div
    data-canvas="dark"
    className={`${schibstedGrotesk.variable} font-sans`}
    style={{ minHeight: "100vh", padding: "2rem" }}
  >
    <Story />
  </div>
);

const preview: Preview = {
  decorators: [withCanvas],
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
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
