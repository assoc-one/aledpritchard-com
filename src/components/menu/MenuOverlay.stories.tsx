import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { useNav } from "@/lib/navigation";

import { MenuOverlay } from "./MenuOverlay";

const meta: Meta<typeof MenuOverlay> = {
  title: "Menu/MenuOverlay",
  component: MenuOverlay,
  parameters: { layout: "fullscreen" },
  // The overlay covers the viewport; let it fill the canvas without preview padding.
  decorators: [
    (Story) => (
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof MenuOverlay>;

export const Closed: Story = {
  async beforeEach() {
    useNav.setState({ mode: "stable" });
  },
};

export const Open: Story = {
  async beforeEach() {
    useNav.setState({ mode: "menu", returnTo: "stable" });
  },
};
