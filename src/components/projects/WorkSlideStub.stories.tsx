import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { useNav } from "@/lib/navigation";

import { WorkSlideStub } from "./WorkSlideStub";

// WorkSlideStub is a route stub — mounted by /work/[slug]/[n] to push the
// store into the slide state at the requested slide number (1-based in the
// URL, 0-based in the store). Renders nothing; visual UI lives in FrameShell.
//
// See WorkCoverStub.stories.tsx for the same documentary pattern.
const meta: Meta<typeof WorkSlideStub> = {
  title: "Projects/WorkSlideStub",
  component: WorkSlideStub,
  parameters: { layout: "centered" },
  args: { slug: "jpmc", n: "3" },
};
export default meta;

type Story = StoryObj<typeof WorkSlideStub>;

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
