import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { useNav } from "@/lib/navigation";

import { IndexCounter } from "./IndexCounter";

const meta: Meta<typeof IndexCounter> = {
  title: "Frame/IndexCounter",
  component: IndexCounter,
};
export default meta;

type Story = StoryObj<typeof IndexCounter>;

// Outside a project context (stable / menu / inner pages) the counter is
// fully transparent — invisible by design.
export const StableMode: Story = {
  async beforeEach() {
    useNav.setState({ mode: "stable" });
  },
};

// On a project cover the project number is visible at the right edge.
export const CoverMode: Story = {
  async beforeEach() {
    useNav.setState({ mode: "cover", projectIndex: 1, slideIndex: 0 });
  },
};

// On a slide the project number shifts left and the slide number fades in
// beside it.
export const SlideMode: Story = {
  async beforeEach() {
    useNav.setState({ mode: "slide", projectIndex: 1, slideIndex: 4 });
  },
};
