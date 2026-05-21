// Page title for inner routes (About / Contact / Writing). Sits at the start
// of the list column, vertically centred — the same baseline as the name and
// the project list's tagline.
export function PageTitleSlot({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none fixed left-[var(--frame-col-details)] top-[50vh] z-30 -translate-y-1/2 text-text-white transition-colors duration-[var(--duration-base)] ease-standard canvas-light:text-text-dark">
      {children}
    </div>
  );
}
