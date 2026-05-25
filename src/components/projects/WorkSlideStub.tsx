"use client";

import { useEffect } from "react";

import { useNav } from "@/lib/navigation";

// Route stub — lands the navigation store in a project slide state.
// `n` is the 1-based slide number from the URL.
export function WorkSlideStub({ slug, n }: { slug: string; n: string }) {
  const goToSlideBySlug = useNav((s) => s.goToSlideBySlug);
  useEffect(() => {
    const index = Number.parseInt(n, 10);
    if (Number.isFinite(index)) goToSlideBySlug(slug, index - 1);
  }, [slug, n, goToSlideBySlug]);
  return null;
}
