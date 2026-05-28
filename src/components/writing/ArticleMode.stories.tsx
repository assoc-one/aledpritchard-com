import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ArticleMode } from "./ArticleMode";

// Side-effect-only — reads `usePathname()`, derives the article slug from
// the trailing segment, and pushes the store into the `article` state.
// Renders nothing. Override `nextjs.navigation.pathname` to test different
// slug derivations.
const meta: Meta<typeof ArticleMode> = {
  title: "Writing/ArticleMode",
  component: ArticleMode,
  parameters: {
    layout: "centered",
    nextjs: { navigation: { pathname: "/writing/clarity-direction-momentum" } },
  },
};
export default meta;

type Story = StoryObj<typeof ArticleMode>;

export const Effect: Story = {};
