"use client";

import { useEffect } from "react";

import { useParams } from "next/navigation";

import { useNav } from "@/lib/navigation";

// Route stub — lands the navigation store in the project cover state.
export default function WorkCoverStub() {
  const params = useParams<{ slug: string }>();
  const goToProjectBySlug = useNav((s) => s.goToProjectBySlug);
  useEffect(() => {
    goToProjectBySlug(params.slug);
  }, [params.slug, goToProjectBySlug]);
  return null;
}
