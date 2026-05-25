import { WritingIndex } from "@/components/writing/WritingIndex";
import { WritingMode } from "@/components/writing/WritingMode";
import { pageMetadata } from "@/lib/site";
import { getAllArticles } from "@/sanity/queries";

export const metadata = pageMetadata({
  title: "Writing",
  description: "Essays and notes by Aled Pritchard.",
  path: "/writing",
});

// Writing index — server-fetched, rendered in the third column.
export default async function WritingPage() {
  const articles = await getAllArticles();

  return (
    <>
      <WritingMode />
      <main className="h-screen overflow-y-auto pl-[calc(var(--frame-col-details)+var(--frame-col-list))]">
        <h1 className="sr-only">Writing</h1>
        <div className="max-w-[720px] p-[var(--frame-edge)]">
          <WritingIndex articles={articles} />
        </div>
      </main>
    </>
  );
}
