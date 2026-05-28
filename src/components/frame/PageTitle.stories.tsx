import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { useNav } from "@/lib/navigation";

import { PageTitle } from "./PageTitle";

const meta: Meta<typeof PageTitle> = {
  title: "Frame/PageTitle",
  component: PageTitle,
};
export default meta;

type Story = StoryObj<typeof PageTitle>;

// Inner-page title shown in PageTitleSlot. Title text is derived from the
// navigation mode — "Writing" / "About" / "Contact" / "Writing" (for article).
export const WritingMode: Story = {
  async beforeEach() {
    useNav.setState({ mode: "writing" });
  },
};

export const ArticleMode: Story = {
  async beforeEach() {
    useNav.setState({ mode: "article", articleSlug: "clarity-direction-momentum" });
  },
};

export const AboutMode: Story = {
  async beforeEach() {
    useNav.setState({ mode: "about" });
  },
};

export const ContactMode: Story = {
  async beforeEach() {
    useNav.setState({ mode: "contact" });
  },
};
