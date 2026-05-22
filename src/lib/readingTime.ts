import type { ARTICLE_BY_SLUG_QUERY_RESULT } from "@/sanity/types.gen";

type ArticleBody = NonNullable<ARTICLE_BY_SLUG_QUERY_RESULT>["body"];

const WORDS_PER_MINUTE = 200;

// Estimated reading time in whole minutes, from the article's portable text.
// Counts the text in every block's spans. Always at least 1 minute.
export function readingTimeMinutes(body: ArticleBody): number {
  const words = (body ?? [])
    .flatMap((block) => block.children ?? [])
    .map((span) => span.text ?? "")
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
