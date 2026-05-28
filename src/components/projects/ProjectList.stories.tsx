import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { useNav } from "@/lib/navigation";
import type { Project } from "@/sanity/queries";

import { ProjectList } from "./ProjectList";

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
    metadata: null,
    publishedAt: "2026-01-01T00:00:00Z",
  },
];

const navProjects = mockProjects.map((p) => ({
  slug: p.slug ?? "",
  slideCount: p.slides?.length ?? 0,
}));

const meta: Meta<typeof ProjectList> = {
  title: "Projects/ProjectList",
  component: ProjectList,
  parameters: { layout: "fullscreen" },
  args: { projects: mockProjects, tagline: "Lorem ipsum doler est" },
  // ProjectList scrolls itself centred inside `.frame-list-column`. Wrap in
  // a 320px column with that class so the scroll logic targets it.
  decorators: [
    (Story) => (
      <div
        className="frame-list-column"
        style={{
          width: "320px",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ProjectList>;

// Cold-open: items hidden behind the reveal delay (sessionStorage cleared by
// the preview-level beforeEach). The tagline is visible; items follow after
// REVEAL_DELAY ms.
export const StableModeUnrevealed: Story = {
  async beforeEach() {
    useNav.setState({ mode: "stable", projects: navProjects });
  },
};

// Once the reveal has fired (in the same session) items are visible without
// staggering. Force the post-reveal state by pre-setting the sessionStorage flag.
export const StableModeRevealed: Story = {
  async beforeEach() {
    sessionStorage.setItem("cos-projects-revealed", "1");
    useNav.setState({ mode: "stable", projects: navProjects });
  },
};

// On a cover: every item is interactive; the active item is highlighted.
export const CoverMode: Story = {
  async beforeEach() {
    useNav.setState({
      mode: "cover",
      projectIndex: 1,
      projects: navProjects,
    });
  },
};

// On a slide: same visual as cover (active highlighted, others dimmed).
export const SlideMode: Story = {
  async beforeEach() {
    useNav.setState({
      mode: "slide",
      projectIndex: 1,
      slideIndex: 2,
      projects: navProjects,
    });
  },
};
