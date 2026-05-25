import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

// Served at /robots.txt. The Studio, API routes, and the internal styleguide
// are kept out of search indexes.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/api/", "/styleguide"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
