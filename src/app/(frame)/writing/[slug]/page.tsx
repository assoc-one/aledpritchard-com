import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleMode } from "@/components/writing/ArticleMode";
import { PortableBody } from "@/components/writing/PortableBody";
import { readingTimeMinutes } from "@/lib/readingTime";
import { siteName, siteUrl } from "@/lib/site";
import { getAllArticles, getArticleBySlug } from "@/sanity/queries";

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.flatMap((article) =>
    article.slug ? [{ slug: article.slug }] : [],
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.lede,
    alternates: { canonical: `/writing/${slug}` },
    openGraph: {
      type: "article",
      title: `${article.title} — ${siteName}`,
      description: article.lede ?? undefined,
      url: `${siteUrl}/writing/${slug}`,
      publishedTime: article.publishedAt ?? undefined,
    },
    twitter: {
      title: `${article.title} — ${siteName}`,
      description: article.lede ?? undefined,
    },
  };
}

// Article reading page — server-fetched by slug; an unknown slug renders the
// adjacent not-found.tsx inside the frame.
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const minutes = readingTimeMinutes(article.body);
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;
  const meta = [date, `${minutes} min read`].filter(Boolean).join(" · ");

  return (
    <>
      <ArticleMode />
      <main className="h-screen overflow-y-auto pl-[calc(var(--frame-col-details)+var(--frame-col-list))]">
        <article className="max-w-[680px] p-[var(--frame-edge)]">
          <Link
            href="/writing"
            className="mb-12 inline-block text-text-dark-70 transition-colors duration-[var(--duration-fast)] ease-out hover:text-text-dark"
          >
            ← Back to writing
          </Link>
          <h1 className="mb-2 text-[2rem] font-bold leading-tight text-text-dark">
            {article.title}
          </h1>
          <p className="mb-10 text-text-dark-40">{meta}</p>
          <PortableBody value={article.body} />
        </article>
      </main>
    </>
  );
}
