import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { WorkIntroStub } from "@/components/projects/WorkIntroStub";
import { WorkSlideStub } from "@/components/projects/WorkSlideStub";
import { siteName, siteUrl } from "@/lib/site";
import { getAllProjects, getProjectBySlug } from "@/sanity/queries";
import type { Project } from "@/sanity/queries";

// The [n] segment numbers the project's sub-states: 0 is the editorial intro
// (only for projects with overview content), 1..N are the slides. Treating
// intro as "slide 0" keeps a single dynamic route for all of a project's
// inner steps (URL pattern confirmed on COS-195 Q1).

// Flatten the overview's portable-text body to plain paragraphs for the
// sr-only landmark, so the prose is reachable by screen readers and matches
// the visible ProjectOverview content.
function overviewParagraphs(
  body: NonNullable<Project["overview"]>["body"],
): string[] {
  if (!body) return [];
  return body
    .map((block) =>
      (block.children ?? []).map((child) => child.text ?? "").join(""),
    )
    .filter((text) => text.trim().length > 0);
}

export async function generateStaticParams() {
  // Each project's inner URLs: /work/[slug]/1 .. /work/[slug]/N for slides,
  // plus /work/[slug]/0 for the intro when the project has overview content.
  const projects = await getAllProjects();
  return projects.flatMap((project) => {
    if (!project.slug) return [];
    const count = project.slides?.length ?? 0;
    const params = Array.from({ length: count }, (_, i) => ({
      slug: project.slug!,
      n: String(i + 1),
    }));
    if (project.overview?.title) {
      params.unshift({ slug: project.slug, n: "0" });
    }
    return params;
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; n: string }>;
}): Promise<Metadata> {
  const { slug, n } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  // Intro (n === "0") gets its own editorial title/description; slide views are
  // sub-states canonicalised to the project cover so search engines index a
  // single URL per project.
  if (n === "0" && project.overview?.title) {
    const title = project.overview.title;
    const description = project.overview.subtitle ?? project.summary ?? undefined;
    return {
      title,
      description,
      alternates: { canonical: `/work/${slug}` },
      openGraph: {
        type: "article",
        title: `${title} — ${siteName}`,
        description,
        url: `${siteUrl}/work/${slug}/0`,
      },
      twitter: { title: `${title} — ${siteName}`, description },
    };
  }

  return {
    title: project.title,
    description: project.summary ?? undefined,
    alternates: { canonical: `/work/${slug}` },
  };
}

// Server route — the [n] segment is the project sub-state. The framed visuals
// render from the navigation store; the sr-only landmark carries the project
// title (and, for intro, the overview prose) for screen readers.
export default async function WorkStepPage({
  params,
}: {
  params: Promise<{ slug: string; n: string }>;
}) {
  const { slug, n } = await params;
  const project = await getProjectBySlug(slug);

  // Intro state. A project without overview has no intro — redirect a direct
  // /0 hit to the cover so old bookmarks stay graceful if overview is removed.
  if (n === "0") {
    if (!project?.overview?.title) redirect(`/work/${slug}`);
    const { title, subtitle, body } = project.overview;
    return (
      <>
        <main className="sr-only">
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
          {overviewParagraphs(body).map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </main>
        <WorkIntroStub slug={slug} />
      </>
    );
  }

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
