import { CvMode } from "@/components/cv/CvMode";
import { getCv } from "@/sanity/queries";

// CV page — MVP: heading, intro, and a prominent PDF download when one has
// been uploaded in Studio; a graceful message otherwise.
export default async function CvPage() {
  const cv = await getCv();

  return (
    <>
      <CvMode />
      <main className="h-screen overflow-y-auto pl-[calc(var(--frame-col-details)+var(--frame-col-list))]">
        <div className="max-w-[680px] p-[var(--frame-edge)]">
          <h1 className="mb-2 text-[2rem] font-bold leading-tight text-text-dark">
            {cv?.heading ?? "Curriculum Vitae"}
          </h1>
          {cv?.intro && (
            <p className="mb-8 max-w-[522px] leading-[1.4] text-text-dark-70">
              {cv.intro}
            </p>
          )}
          {cv?.pdfUrl ? (
            <a
              href={`${cv.pdfUrl}?dl`}
              className="inline-block font-bold text-text-dark underline transition-opacity duration-[var(--duration-fast)] ease-out hover:opacity-60"
            >
              Download PDF →
            </a>
          ) : (
            <p className="text-text-dark-70">
              The downloadable CV is coming soon.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
