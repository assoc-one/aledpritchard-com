import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ContactMode } from "./ContactMode";

// Side-effect-only — mounts and calls `useNav.goContact()` so the persistent
// frame responds (project list hidden, "Contact" title shown, canvas flips
// to light). Renders nothing visible.
const meta: Meta<typeof ContactMode> = {
  title: "Contact/ContactMode",
  component: ContactMode,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ContactMode>;

export const Effect: Story = {};
