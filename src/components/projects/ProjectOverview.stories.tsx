import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { useNav } from "@/lib/navigation";
import type { Project } from "@/sanity/queries";

import { ProjectOverview } from "./ProjectOverview";

// Portable-text body helper — builds normal blocks the way the Sanity query
// returns them, so the story exercises the real PortableText render path.
function paragraph(text: string, key: string) {
  return {
    _type: "block" as const,
    _key: key,
    style: "normal" as const,
    markDefs: null,
    children: [{ _type: "span" as const, _key: `${key}s`, text, marks: [] }],
  };
}

// One project with full overview content (mirrors Figma 119:3165), one without.
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
    overview: {
      title: "Scaling design systems",
      subtitle:
        "AI product design, Knowledge systems, Conversational UX, Design-led experimentation",
      meta: [
        { label: "Company", value: "JPMorganChase" },
        { label: "Role", value: "Design Lead" },
        { label: "Period", value: "2022–2025" },
      ],
      body: [
        paragraph(
          "Senior design candidates typically present their experience through static artefacts such as CVs, portfolios, and case studies. For hiring managers and recruiters, evaluating a candidate often requires navigating multiple documents and interpreting relevance to a specific role.",
          "b1",
        ),
        paragraph(
          "We built a knowledge system that let the work answer questions directly — collapsing the distance between the portfolio and the conversation it was meant to start.",
          "b2",
        ),
      ],
    },
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

const meta: Meta<typeof ProjectOverview> = {
  title: "Projects/ProjectOverview",
  component: ProjectOverview,
  parameters: { layout: "fullscreen" },
  globals: { canvas: "dark" },
  args: { projects: mockProjects },
};
export default meta;

type Story = StoryObj<typeof ProjectOverview>;

// Intro mode on a project with overview content — the component is visible.
export const Intro: Story = {
  async beforeEach() {
    useNav.setState({ mode: "intro", projectIndex: 0, slideIndex: 0 });
  },
};

// Intro mode on a project WITHOUT overview content — renders nothing.
export const IntroNoOverview: Story = {
  async beforeEach() {
    useNav.setState({ mode: "intro", projectIndex: 1, slideIndex: 0 });
  },
};

// Any non-intro mode — hidden (opacity 0, inert) even with overview present.
export const HiddenOnCover: Story = {
  async beforeEach() {
    useNav.setState({ mode: "cover", projectIndex: 0, slideIndex: 0 });
  },
};
