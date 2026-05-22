import Link from "next/link";

import type { ALL_ARTICLES_QUERY_RESULT } from "@/sanity/types.gen";

// The writing index — title + lede rows, newest first. No dates, per the
// prototype. Rows are real links so deep-linking and open-in-new-tab work.
export function WritingIndex({
  articles,
}: {
  articles: ALL_ARTICLES_QUERY_RESULT;
}) {
  if (articles.length === 0) {
    return <p className="text-text-dark-70">No articles published yet.</p>;
  }

  return (
    <div className="flex flex-col">
      {articles.map((article) => (
        <Link
          key={article._id}
          href={`/writing/${article.slug}`}
          className="group block border-t border-black/15 py-6 transition-opacity duration-[var(--duration-fast)] ease-out last:border-b hover:opacity-55"
        >
          <span className="mb-1 block text-text-dark">
            {article.title}
            <span className="ml-1.5 inline-block transition-transform duration-[var(--duration-fast)] ease-out group-hover:translate-x-1">
              →
            </span>
          </span>
          <span className="block text-text-dark-70">{article.lede}</span>
        </Link>
      ))}
    </div>
  );
}
