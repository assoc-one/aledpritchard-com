"use client";

import { useEffect } from "react";

import { useParams } from "next/navigation";

import { useNav } from "@/lib/navigation";

// Route stub — lands the navigation store in the article state.
export default function ArticleStub() {
  const params = useParams<{ slug: string }>();
  const openArticle = useNav((s) => s.openArticle);
  useEffect(() => {
    openArticle(params.slug);
  }, [params.slug, openArticle]);
  return null;
}
