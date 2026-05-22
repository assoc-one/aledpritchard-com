import Link from "next/link";

import { ArticleMode } from "@/components/writing/ArticleMode";

// Rendered for an unknown article slug. Lives inside the frame layout, so the
// frame chrome and light canvas stay in place.
export default function ArticleNotFound() {
  return (
    <>
      <ArticleMode />
      <main className="h-screen overflow-y-auto pl-[calc(var(--frame-col-details)+var(--frame-col-list))]">
        <div className="max-w-[680px] p-[var(--frame-edge)]">
          <p className="mb-6 text-text-dark">
            Article not found — it may have moved or never existed.
          </p>
          <Link
            href="/writing"
            className="inline-block text-text-dark-70 transition-colors duration-[var(--duration-fast)] ease-out hover:text-text-dark"
          >
            ← Back to writing
          </Link>
        </div>
      </main>
    </>
  );
}
