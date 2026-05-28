import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import type { Project } from "@/sanity/queries";

import { VisualLayer } from "./VisualLayer";

// VisualLayer reads Sanity image assets and pipes them through `urlFor()`,
// which requires real Sanity CDN-resolvable references. Mocking those in a
// story would mean shipping a fake Sanity image asset reference and a
// matching @sanity/image-url client — out of scope for COS-156.
//
// This story renders the component with an empty project list so the
// container structure is visible (an empty fixed-position layer) without
// faking image URLs. Visual coverage of the real cross-fade lives in the
// live app for now.
const emptyProjects: Project[] = [];

const meta: Meta<typeof VisualLayer> = {
  title: "Projects/VisualLayer",
  component: VisualLayer,
  parameters: { layout: "fullscreen" },
  args: { projects: emptyProjects },
};
export default meta;

type Story = StoryObj<typeof VisualLayer>;

export const Default: Story = {};
