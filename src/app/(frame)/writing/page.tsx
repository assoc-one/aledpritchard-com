import { WritingIndex } from "@/components/writing/WritingIndex";
import { WritingMode } from "@/components/writing/WritingMode";
import { getAllArticles } from "@/sanity/queries";

// Writing index — server-fetched, rendered in the third column.
export default async function WritingPage() {
  const articles = await getAllArticles();

  return (
    <>
      <WritingMode />
      <main className="h-screen overflow-y-auto pl-[calc(var(--frame-col-details)+var(--frame-col-list))]">
        <div className="max-w-[720px] p-[var(--frame-edge)]">
          <WritingIndex articles={articles} />
        </div>
      </main>
    </>
  );
}
