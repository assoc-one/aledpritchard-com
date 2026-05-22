"use client";

import { useEffect } from "react";

import { usePathname } from "next/navigation";

import { useNav } from "@/lib/navigation";

// Sets the navigation store to the article state, deriving the slug from the
// current path. Used by both the article page and the article 404, so the
// store's path matches the URL and routerSync does not redirect.
export function ArticleMode() {
  const pathname = usePathname();
  const openArticle = useNav((s) => s.openArticle);
  useEffect(() => {
    const slug = decodeURIComponent(
      pathname.split("/").filter(Boolean).pop() ?? "",
    );
    if (slug) openArticle(slug);
  }, [pathname, openArticle]);
  return null;
}
