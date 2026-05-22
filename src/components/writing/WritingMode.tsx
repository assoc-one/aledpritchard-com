"use client";

import { useEffect } from "react";

import { useNav } from "@/lib/navigation";

// Sets the navigation store to the writing state on mount, so the frame
// responds (project list hidden, page title shown, ESC returns home).
export function WritingMode() {
  const goWriting = useNav((s) => s.goWriting);
  useEffect(() => {
    goWriting();
  }, [goWriting]);
  return null;
}
