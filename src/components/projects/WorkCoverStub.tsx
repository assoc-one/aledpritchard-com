"use client";

import { useEffect } from "react";

import { useNav } from "@/lib/navigation";

// Route stub — lands the navigation store in the project cover state. The
// visible project UI is driven by the frame; this renders nothing.
export function WorkCoverStub({ slug }: { slug: string }) {
  const goToProjectBySlug = useNav((s) => s.goToProjectBySlug);
  useEffect(() => {
    goToProjectBySlug(slug);
  }, [slug, goToProjectBySlug]);
  return null;
}
