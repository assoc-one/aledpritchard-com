import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

// Served at /robots.txt. The Studio and API routes are kept out of search
// indexes.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
