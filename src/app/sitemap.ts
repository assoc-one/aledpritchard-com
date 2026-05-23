import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";
import { getAllArticles, getAllProjects } from "@/sanity/queries";

// Served at /sitemap.xml. Lists every public route: the static pages, plus a
// cover URL per project and a page per article. Project slide views
// (/work/[slug]/[n]) canonicalise to their cover, so they are not listed.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, articles] = await Promise.all([
    getAllProjects(),
    getAllArticles(),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "monthly", priority: 1 },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/writing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.flatMap((project) =>
    project.slug
      ? [
          {
            url: `${siteUrl}/work/${project.slug}`,
            lastModified: project._updatedAt
              ? new Date(project._updatedAt)
              : now,
            changeFrequency: "monthly" as const,
            priority: 0.9,
          },
        ]
      : [],
  );

  const articleRoutes: MetadataRoute.Sitemap = articles.flatMap((article) =>
    article.slug
      ? [
          {
            url: `${siteUrl}/writing/${article.slug}`,
            lastModified: article.publishedAt
              ? new Date(article.publishedAt)
              : now,
            changeFrequency: "yearly" as const,
            priority: 0.6,
          },
        ]
      : [],
  );

  return [...staticRoutes, ...projectRoutes, ...articleRoutes];
}
