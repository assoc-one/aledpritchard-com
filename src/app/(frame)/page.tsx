"use client";

import { useEffect } from "react";

import { useNav } from "@/lib/navigation";

// Route stub — sets navigation state and renders nothing. The visible
// content (project list, visual layer) is driven by the frame in COS-140.
export default function HomeStub() {
  const goHome = useNav((s) => s.goHome);
  useEffect(() => {
    goHome();
  }, [goHome]);
  return null;
}
