"use client";

import { useNav } from "@/lib/navigation";

// Full-screen red menu overlay. Sits below the frame chrome (z-20) so the
// Design Director / Aled Pritchard / Menu labels stay visible on top of it.
// Slides in from the left; items reveal with a staggered cascade.
export function MenuOverlay() {
  const mode = useNav((s) => s.mode);
  const goHome = useNav((s) => s.goHome);
  const goWriting = useNav((s) => s.goWriting);
  const goAbout = useNav((s) => s.goAbout);
  const goContact = useNav((s) => s.goContact);

  const open = mode === "menu";
  const items = [
    { label: "Projects", onClick: goHome },
    { label: "Writing", onClick: goWriting },
    { label: "About", onClick: goAbout },
    { label: "Contact", onClick: goContact },
  ];

  return (
    <div
      aria-hidden={!open}
      className="fixed inset-0 z-[15] grid grid-cols-[var(--frame-col-details)_var(--frame-col-list)_1fr] bg-canvas-red"
      style={{
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 700ms cubic-bezier(0.7, 0, 0.2, 1)",
        pointerEvents: open ? "auto" : "none",
      }}
    >
      <div />
      <div />
      <div className="flex flex-col justify-end gap-2 pb-[200px] pr-[var(--frame-edge)]">
        {items.map((item, index) => (
          <button
            key={item.label}
            type="button"
            tabIndex={open ? 0 : -1}
            onClick={item.onClick}
            className="w-fit text-left text-display font-bold uppercase text-text-white hover:text-text-white-40"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateX(0)" : "translateX(-80px)",
              transition:
                "opacity 600ms var(--ease-out-strong), transform 700ms var(--ease-out-strong), color 150ms ease-out",
              transitionDelay: open ? `${250 + index * 110}ms` : "0ms",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
