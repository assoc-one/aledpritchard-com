"use client";

import { useState } from "react";

import { type Mode, useNav } from "@/lib/navigation";

// The inner-page title shown in PageTitleSlot, driven by navigation mode.
const TITLES: Partial<Record<Mode, string>> = {
  writing: "Writing",
  article: "Writing",
  about: "About",
  contact: "Contact",
};

export function PageTitle() {
  const mode = useNav((s) => s.mode);
  const title = TITLES[mode];

  // Keep the last title rendered while fading out, so the text doesn't blank
  // before the opacity transition finishes. Updated during render — React's
  // pattern for deriving state from a changing input, no effect needed.
  const [shown, setShown] = useState(title ?? "");
  if (title && title !== shown) setShown(title);

  return (
    <span
      className="transition-opacity duration-[var(--duration-base)] ease-standard"
      style={{ opacity: title ? 1 : 0 }}
    >
      {shown}
    </span>
  );
}
