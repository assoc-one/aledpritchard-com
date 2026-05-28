import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PageTitleSlot } from "./PageTitleSlot";

const meta: Meta<typeof PageTitleSlot> = {
  title: "Frame/PageTitleSlot",
  component: PageTitleSlot,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof PageTitleSlot>;

// Pure positioning slot — fixed at the start of the list column, vertically
// centred. Visible only when a child renders content (PageTitle in production).
export const Default: Story = {
  args: {
    children: <span>Writing</span>,
  },
};
