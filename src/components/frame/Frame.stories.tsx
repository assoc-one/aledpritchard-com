import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { useNav } from "@/lib/navigation";
import type { Project } from "@/sanity/queries";

import { Frame } from "./Frame";

// Minimal Project[] mock — only the fields the persistent frame UI reads:
// _id (list keys), title (list labels), slug + slides (store hydration in
// FrameShell — here we feed the store directly via beforeEach).
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
  {
    _id: "p3",
    _type: "project",
    _createdAt: "2026-01-01T00:00:00Z",
    _updatedAt: "2026-01-01T00:00:00Z",
    title: "Bud",
    slug: "bud",
    cover: null,
    slides: null,
    order: 3,
    summary: null,
    overview: null,
    metadata: null,
    publishedAt: "2026-01-01T00:00:00Z",
  },
];

const meta: Meta<typeof Frame> = {
  title: "Frame/Frame",
  component: Frame,
  parameters: { layout: "fullscreen" },
  args: {
    projects: mockProjects,
    tagline: "Lorem ipsum doler est",
    children: null,
  },
};
export default meta;

type Story = StoryObj<typeof Frame>;

// The persistent layout shell — frame chrome, project list column, menu
// overlay slot, index/title slots. Children are the per-route page content.
export const Default: Story = {
  async beforeEach() {
    useNav.setState({
      mode: "stable",
      projects: mockProjects.map((p) => ({
        slug: p.slug ?? "",
        slideCount: p.slides?.length ?? 0,
        hasOverview: Boolean(p.overview?.title),
      })),
    });
  },
};
