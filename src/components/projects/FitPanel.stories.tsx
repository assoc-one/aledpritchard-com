import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { useNav } from "@/lib/navigation";
import type { Project } from "@/sanity/queries";

import { FitPanel } from "./FitPanel";

// Mock with one full-variant slide and one fit-variant slide so the two
// stories below can pick which is active via slideIndex.
const mockProjects: Project[] = [
  {
    _id: "p1",
    _type: "project",
    _createdAt: "2026-01-01T00:00:00Z",
    _updatedAt: "2026-01-01T00:00:00Z",
    title: "JPMorgan Chase",
    slug: "jpmc",
    cover: null,
    slides: [
      { image: null, variant: "full", caption: null },
      { image: null, variant: "fit", caption: null },
    ],
    order: 1,
    summary: null,
    overview: null,
    metadata: null,
    publishedAt: "2026-01-01T00:00:00Z",
  },
];

const meta: Meta<typeof FitPanel> = {
  title: "Projects/FitPanel",
  component: FitPanel,
  parameters: { layout: "fullscreen" },
  args: { projects: mockProjects },
};
export default meta;

type Story = StoryObj<typeof FitPanel>;

// `full` slide variant: panel is transparent (the slide image is full-bleed).
export const FullSlide: Story = {
  async beforeEach() {
    useNav.setState({ mode: "slide", projectIndex: 0, slideIndex: 0 });
  },
};

// `fit` slide variant: panel is opaque, covering the left two columns so the
// slide image reads as bounded to the right column.
export const FitSlide: Story = {
  async beforeEach() {
    useNav.setState({ mode: "slide", projectIndex: 0, slideIndex: 1 });
  },
};
