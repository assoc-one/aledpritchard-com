import type { Metadata } from "next";

import { WorkCoverStub } from "@/components/projects/WorkCoverStub";
import { siteName, siteUrl } from "@/lib/site";
import { getAllProjects, getProjectBySlug } from "@/sanity/queries";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.flatMap((project) =>
    project.slug ? [{ slug: project.slug }] : [],
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary ?? undefined,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      type: "article",
      title: `${project.title} — ${siteName}`,
      description: project.summary ?? undefined,
      url: `${siteUrl}/work/${slug}`,
    },
    twitter: {
      title: `${project.title} — ${siteName}`,
      description: project.summary ?? undefined,
    },
  };
}

// Server route — resolves per-project metadata, then hands the slug to the
// client stub. The framed visuals render from the navigation store; the
// sr-only heading gives screen readers the project title.
export default async function WorkCoverPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return (
    <>
      <main className="sr-only">
        <h1>{project?.title ?? "Work"}</h1>
        {project?.summary ? <p>{project.summary}</p> : null}
      </main>
      <WorkCoverStub slug={slug} />
    </>
  );
}
