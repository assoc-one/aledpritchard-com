"use client";

import { useEffect } from "react";

import { useNav } from "@/lib/navigation";

// Route stub — sets the About state. Page content arrives in COS-142.
export default function AboutStub() {
  const goAbout = useNav((s) => s.goAbout);
  useEffect(() => {
    goAbout();
  }, [goAbout]);
  return null;
}
