import { ImageResponse } from "next/og";

import { siteName } from "@/lib/site";
import { urlFor } from "@/sanity/image";
import { getAllProjects, getProjectBySlug } from "@/sanity/queries";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.flatMap((project) =>
    project.slug ? [{ slug: project.slug }] : [],
  );
}

// Per-project social-share card — the project cover with the title overlaid.
export const alt = `Project by ${siteName}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  // No project or no cover — fall back to a branded title card.
  if (!project?.cover) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#000000",
            color: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "90px",
          }}
        >
          <div style={{ fontSize: 34, color: "rgba(255,255,255,0.7)" }}>
            {siteName}
          </div>
          <div style={{ fontSize: 84, fontWeight: 700, marginTop: 12 }}>
            {project?.title ?? "Work"}
          </div>
        </div>
      ),
      { ...size },
    );
  }

  const coverUrl = urlFor(project.cover)
    .width(1200)
    .height(630)
    .fit("crop")
    .url();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#000000",
        }}
      >
        <img
          src={coverUrl}
          width={1200}
          height={630}
          style={{ objectFit: "cover" }}
          alt=""
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            padding: "64px",
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.85))",
          }}
        >
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.7)" }}>
            {siteName}
          </div>
          <div
            style={{ fontSize: 72, fontWeight: 700, color: "#ffffff" }}
          >
            {project.title}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
