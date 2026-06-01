import { MenuOverlay } from "@/components/menu/MenuOverlay";
import { ProjectList } from "@/components/projects/ProjectList";
import type { Project } from "@/sanity/queries";

import { FrameDetails } from "./FrameDetails";
import { IndexCounter } from "./IndexCounter";
import { IndexSlot } from "./IndexSlot";
import { PageTitle } from "./PageTitle";
import { PageTitleSlot } from "./PageTitleSlot";

// Persistent layout shell. Renders, back to front:
//   1. the canvas background (recoloured by [data-canvas])
//   2. the page content layer (children)
//   3. the frame chrome overlay — a 320 / 320 / flex grid, pointer-events
//      disabled except for the interactive columns
//   4. the index counter
export function Frame({
  projects,
  tagline,
  children,
}: {
  projects: Project[];
  tagline: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        aria-hidden
        className="fixed inset-0 z-0 bg-canvas-dark transition-colors duration-[var(--duration-base)] ease-standard canvas-light:bg-canvas-light"
      />
      <div className="relative z-10">{children}</div>
      <div className="pointer-events-none fixed inset-0 z-20 grid grid-cols-[var(--frame-col-details)_var(--frame-col-list)_1fr]">
        <FrameDetails />
        {/* Column 2 — the scrollable project list; also the wheel target. */}
        <div className="frame-list-column pointer-events-auto h-screen overflow-y-auto">
          <ProjectList projects={projects} tagline={tagline} />
        </div>
        <div />
      </div>
      <MenuOverlay />
      <IndexSlot>
        <IndexCounter />
      </IndexSlot>
      <PageTitleSlot>
        <PageTitle />
      </PageTitleSlot>
    </>
  );
}
