"use client";

import { useNav } from "@/lib/navigation";

// The inner-page title shown in PageTitleSlot. COS-141 covers the writing
// routes; About/Contact titles are added in COS-142.
export function PageTitle() {
  const mode = useNav((s) => s.mode);
  const visible = mode === "writing" || mode === "article";

  return (
    <span
      className="transition-opacity duration-[var(--duration-base)] ease-standard"
      style={{ opacity: visible ? 1 : 0 }}
    >
      Writing
    </span>
  );
}
