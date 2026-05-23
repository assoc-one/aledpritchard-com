import type { Metadata } from "next";

import { WorkSlideStub } from "@/components/projects/WorkSlideStub";
import { getAllProjects, getProjectBySlug } from "@/sanity/queries";

export async function generateStaticParams() {
  // Each project's slide URLs: /work/[slug]/1 .. /work/[slug]/N
  const projects = await getAllProjects();
  return projects.flatMap((project) => {
    if (!project.slug) return [];
    const count = project.slides?.length ?? 0;
    return Array.from({ length: count }, (_, i) => ({
      slug: project.slug!,
      n: String(i + 1),
    }));
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; n: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  // Slide views are sub-states of one project — canonicalise them to the
  // project cover so search engines index a single URL per project.
  return {
    title: project.title,
    description: project.summary ?? undefined,
    alternates: { canonical: `/work/${slug}` },
  };
}

// Server route — the [n] segment is the 1-based slide number. The framed
// visuals render from the navigation store; the sr-only heading carries
// the project title for screen readers.
export default async function WorkSlidePage({
  params,
}: {
  params: Promise<{ slug: string; n: string }>;
}) {
  const { slug, n } = await params;
  const project = await getProjectBySlug(slug);
  const total = project?.slides?.length ?? 0;
  return (
    <>
      <main className="sr-only">
        <h1>{project?.title ?? "Work"}</h1>
        <p>{total > 0 ? `Slide ${n} of ${total}` : `Slide ${n}`}</p>
      </main>
      <WorkSlideStub slug={slug} n={n} />
    </>
  );
}
