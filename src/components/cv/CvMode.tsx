"use client";

import { useEffect } from "react";

import { useNav } from "@/lib/navigation";

// Sets the navigation store to the CV state on mount.
export function CvMode() {
  const goCv = useNav((s) => s.goCv);
  useEffect(() => {
    goCv();
  }, [goCv]);
  return null;
}
