"use client";

import { useEffect } from "react";

import { useNav } from "@/lib/navigation";

// Route stub for /work/[slug]/0 — lands the navigation store in the project's
// intro state. If the project has no overview the store falls back to the
// cover (and the server route redirects the URL to /work/[slug]).
export function WorkIntroStub({ slug }: { slug: string }) {
  const goToIntroBySlug = useNav((s) => s.goToIntroBySlug);
  useEffect(() => {
    goToIntroBySlug(slug);
  }, [slug, goToIntroBySlug]);
  return null;
}
