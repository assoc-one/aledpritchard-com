import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { WritingMode } from "./WritingMode";

// Side-effect-only component — mounts and calls `useNav.goWriting()` so the
// persistent frame responds (project list hidden, "Writing" title shown).
// Renders nothing visible. Inspect the Actions panel / useNav devtools to
// confirm the store update fires.
const meta: Meta<typeof WritingMode> = {
  title: "Writing/WritingMode",
  component: WritingMode,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof WritingMode>;

export const Effect: Story = {};
