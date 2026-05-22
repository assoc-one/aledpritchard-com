"use client";

import { useEffect } from "react";

import { useParams } from "next/navigation";

import { useNav } from "@/lib/navigation";

// Route stub — lands the navigation store in a project slide state.
// The [n] segment is the 1-based slide number.
export default function WorkSlideStub() {
  const params = useParams<{ slug: string; n: string }>();
  const goToSlideBySlug = useNav((s) => s.goToSlideBySlug);
  useEffect(() => {
    const n = Number.parseInt(params.n, 10);
    if (Number.isFinite(n)) goToSlideBySlug(params.slug, n - 1);
  }, [params.slug, params.n, goToSlideBySlug]);
  return null;
}
