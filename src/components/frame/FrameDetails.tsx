// Column 1 of the frame: role, name, and the menu toggle.
// The menu toggle is non-functional here — behaviour lands in COS-138.
export function FrameDetails() {
  return (
    <div className="pointer-events-auto relative h-screen">
      <span className="absolute left-[var(--frame-edge)] top-[var(--frame-edge)] text-text-white-70 transition-colors duration-[var(--duration-base)] ease-standard canvas-light:text-text-dark-70">
        Design Director
      </span>
      <span className="absolute left-[var(--frame-edge)] top-[50vh] -translate-y-1/2 text-text-white transition-colors duration-[var(--duration-base)] ease-standard canvas-light:text-text-dark">
        Aled Pritchard
      </span>
      <button
        type="button"
        className="absolute bottom-[var(--frame-edge)] left-[var(--frame-edge)] text-text-white-70 transition-colors duration-[var(--duration-fast)] ease-out hover:text-text-white canvas-light:text-text-dark-70 canvas-light:hover:text-text-dark"
      >
        Menu
      </button>
    </div>
  );
}
