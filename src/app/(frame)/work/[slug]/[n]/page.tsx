"use client";

import { useEffect } from "react";

import { useParams } from "next/navigation";

import { projectIndexForSlug } from "@/lib/_temp-projects";
import { useNav } from "@/lib/navigation";

// Route stub — lands the navigation store in a project slide state.
// The [n] segment is the 1-based slide number.
export default function WorkSlideStub() {
  const params = useParams<{ slug: string; n: string }>();
  const goToSlide = useNav((s) => s.goToSlide);
  useEffect(() => {
    const index = projectIndexForSlug(params.slug);
    const n = Number.parseInt(params.n, 10);
    if (index >= 0 && Number.isFinite(n)) goToSlide(index, n - 1);
  }, [params.slug, params.n, goToSlide]);
  return null;
}
