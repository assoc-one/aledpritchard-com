import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { useNav } from "@/lib/navigation";

import { WorkCoverStub } from "./WorkCoverStub";

// WorkCoverStub is a route stub — mounted by the /work/[slug] page to push
// the navigation store into the project-cover state. It renders nothing
// visible; the cover UI is owned by the persistent frame (FrameShell + co).
//
// This story documents the side-effect contract by registering a known slug
// in the store and rendering the stub. Watch the Args/Actions panels for
// proof the store update fires — there's no canvas output to inspect.
const meta: Meta<typeof WorkCoverStub> = {
  title: "Projects/WorkCoverStub",
  component: WorkCoverStub,
  parameters: { layout: "centered" },
  args: { slug: "jpmc" },
};
export default meta;

type Story = StoryObj<typeof WorkCoverStub>;

export const Effect: Story = {
  async beforeEach() {
    useNav.setState({
      projects: [
        { slug: "jpmc", slideCount: 5, hasOverview: false },
        { slug: "wallpaper", slideCount: 4, hasOverview: false },
      ],
    });
  },
};
