import { ImageResponse } from "next/og";

import { siteName } from "@/lib/site";
import { getAllArticles, getArticleBySlug } from "@/sanity/queries";

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.flatMap((article) =>
    article.slug ? [{ slug: article.slug }] : [],
  );
}

// Per-article social-share card — branded title card with the lede.
export const alt = `Article by ${siteName}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const title = article?.title ?? "Writing";
  const rawLede = article?.lede ?? "";
  const lede =
    rawLede.length > 160 ? `${rawLede.slice(0, 159).trimEnd()}…` : rawLede;

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
          padding: "90px",
        }}
      >
        <div style={{ fontSize: 30, color: "rgba(255,255,255,0.7)" }}>
          {`${siteName} · Writing`}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            {title}
          </div>
          {lede ? (
            <div
              style={{
                fontSize: 34,
                color: "rgba(255,255,255,0.7)",
                marginTop: 32,
                lineHeight: 1.3,
              }}
            >
              {lede}
            </div>
          ) : null}
        </div>
      </div>
    ),
    { ...size },
  );
}
