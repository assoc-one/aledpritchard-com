import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { IndexSlot } from "./IndexSlot";

const meta: Meta<typeof IndexSlot> = {
  title: "Frame/IndexSlot",
  component: IndexSlot,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof IndexSlot>;

// Pure positioning slot — fixed at right edge, vertically centred. Visible
// only when a child renders content (IndexCounter in production).
export const Default: Story = {
  args: {
    children: <span>02</span>,
  },
};
