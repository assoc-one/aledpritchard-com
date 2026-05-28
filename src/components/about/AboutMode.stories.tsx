import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AboutMode } from "./AboutMode";

// Side-effect-only — mounts and calls `useNav.goAbout()` so the persistent
// frame responds (project list hidden, "About" title shown, canvas flips to
// light). Renders nothing visible.
const meta: Meta<typeof AboutMode> = {
  title: "About/AboutMode",
  component: AboutMode,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AboutMode>;

export const Effect: Story = {};
