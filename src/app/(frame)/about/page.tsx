import { AboutContent } from "@/components/about/AboutContent";
import { AboutMode } from "@/components/about/AboutMode";
import { pageMetadata } from "@/lib/site";
import { getAboutPage } from "@/sanity/queries";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Bio, experience, and advisory work — Aled Pritchard, Design Director.",
  path: "/about",
});

// About page — bio, experience, and advisory, server-fetched from Sanity.
export default async function AboutPage() {
  const about = await getAboutPage();

  return (
    <>
      <AboutMode />
      <main className="h-screen overflow-y-auto pl-[calc(var(--frame-col-details)+var(--frame-col-list))]">
        <h1 className="sr-only">About</h1>
        <div className="max-w-[880px] p-[var(--frame-edge)]">
          <AboutContent about={about} />
        </div>
      </main>
    </>
  );
}
