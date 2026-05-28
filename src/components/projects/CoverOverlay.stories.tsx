import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { useNav } from "@/lib/navigation";

import { CoverOverlay } from "./CoverOverlay";

const meta: Meta<typeof CoverOverlay> = {
  title: "Projects/CoverOverlay",
  component: CoverOverlay,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CoverOverlay>;

// On cover mode the scrim is fully opaque, dimming the cover image so the
// project list reads clearly.
export const Cover: Story = {
  async beforeEach() {
    useNav.setState({ mode: "cover" });
  },
};

// Off any cover (stable / slide / menu / inner pages): transparent.
export const NonCover: Story = {
  async beforeEach() {
    useNav.setState({ mode: "stable" });
  },
};
