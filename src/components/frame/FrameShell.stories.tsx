import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import type { Project } from "@/sanity/queries";

import { FrameShell } from "./FrameShell";

// Same mock shape as Frame.stories — kept colocated per ticket.
const mockProjects: Project[] = [
  {
    _id: "p1",
    _type: "project",
    _createdAt: "2026-01-01T00:00:00Z",
    _updatedAt: "2026-01-01T00:00:00Z",
    title: "JPMorgan Chase",
    slug: "jpmc",
    cover: null,
    slides: null,
    order: 1,
    summary: null,
    overview: null,
    metadata: null,
    publishedAt: "2026-01-01T00:00:00Z",
  },
  {
    _id: "p2",
    _type: "project",
    _createdAt: "2026-01-01T00:00:00Z",
    _updatedAt: "2026-01-01T00:00:00Z",
    title: "Wallpaper*",
    slug: "wallpaper",
    cover: null,
    slides: null,
    order: 2,
    summary: null,
    overview: null,
    metadata: null,
    publishedAt: "2026-01-01T00:00:00Z",
  },
];

const meta: Meta<typeof FrameShell> = {
  title: "Frame/FrameShell",
  component: FrameShell,
  parameters: { layout: "fullscreen" },
  args: {
    projects: mockProjects,
    tagline: "Lorem ipsum doler est",
    children: null,
  },
};
export default meta;

type Story = StoryObj<typeof FrameShell>;

// Canvas is route-derived: anything not /about, /contact, /writing/* renders
// against the dark canvas. The pathname parameter mocks usePathname().
export const CanvasDark: Story = {
  parameters: {
    nextjs: { navigation: { pathname: "/" } },
  },
  globals: { canvas: "dark" },
};

// /about (and /contact, /writing/*) flip the canvas to light. Frame chrome
// labels switch to dark text via the canvas-light: utilities.
export const CanvasLight: Story = {
  parameters: {
    nextjs: { navigation: { pathname: "/about" } },
  },
  globals: { canvas: "light" },
};
