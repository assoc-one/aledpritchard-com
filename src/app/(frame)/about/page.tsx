import { AboutContent } from "@/components/about/AboutContent";
import { AboutMode } from "@/components/about/AboutMode";
import { getAboutPage } from "@/sanity/queries";

// About page — bio, experience, and advisory, server-fetched from Sanity.
export default async function AboutPage() {
  const about = await getAboutPage();

  return (
    <>
      <AboutMode />
      <main className="h-screen overflow-y-auto pl-[calc(var(--frame-col-details)+var(--frame-col-list))]">
        <div className="max-w-[880px] p-[var(--frame-edge)]">
          <AboutContent about={about} />
        </div>
      </main>
    </>
  );
}
