"use client";

import { useEffect } from "react";

import { useNav } from "@/lib/navigation";

// Sets the navigation store to the About state on mount.
export function AboutMode() {
  const goAbout = useNav((s) => s.goAbout);
  useEffect(() => {
    goAbout();
  }, [goAbout]);
  return null;
}
