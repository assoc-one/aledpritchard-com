"use client";

import { useEffect } from "react";

import { useParams } from "next/navigation";

import { projectIndexForSlug } from "@/lib/_temp-projects";
import { useNav } from "@/lib/navigation";

// Route stub — lands the navigation store in the project cover state.
export default function WorkCoverStub() {
  const params = useParams<{ slug: string }>();
  const goToProject = useNav((s) => s.goToProject);
  useEffect(() => {
    const index = projectIndexForSlug(params.slug);
    if (index >= 0) goToProject(index);
  }, [params.slug, goToProject]);
  return null;
}
