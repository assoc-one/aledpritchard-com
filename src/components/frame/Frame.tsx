import { FrameDetails } from "./FrameDetails";

// Persistent layout shell. Renders, back to front:
//   1. the canvas background (recoloured by [data-canvas])
//   2. the page content layer (children)
//   3. the frame chrome overlay — a 480 / 320 / flex grid, pointer-events
//      disabled except for the interactive details column.
export function Frame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div
        aria-hidden
        className="fixed inset-0 z-0 bg-canvas-dark transition-colors duration-[var(--duration-base)] ease-standard canvas-light:bg-canvas-light"
      />
      <div className="relative z-10">{children}</div>
      <div className="pointer-events-none fixed inset-0 z-20 grid grid-cols-[var(--frame-col-details)_var(--frame-col-list)_1fr]">
        <FrameDetails />
        {/* Column 2 — list column. Empty until COS-140; the wheel handler
            uses it as the scroll target. */}
        <div className="frame-list-column pointer-events-auto h-screen" />
      </div>
    </>
  );
}
