import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FrameDetails } from "./FrameDetails";

const meta: Meta<typeof FrameDetails> = {
  title: "Frame/FrameDetails",
  component: FrameDetails,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FrameDetails>;

// Column 1 of the frame: "Design Director" (top), "Aled Pritchard" (centre),
// "Menu" toggle (bottom). Static labels; the menu button calls useNav.toggleMenu().
export const Default: Story = {};
