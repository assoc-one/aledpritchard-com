import { ImageResponse } from "next/og";

import { siteName, siteRole } from "@/lib/site";
import { urlFor } from "@/sanity/image";
import { getSiteSettings } from "@/sanity/queries";

// Default branded social-share card — used for every route without a more
// specific opengraph-image. If an editor uploads a default card to
// Site Settings → "Open Graph image", that wins; otherwise we fall back to the
// generated branded card: muted role above the name.
export const alt = `${siteName} — ${siteRole}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Re-render every 5 min so a Studio edit takes effect without a redeploy. The
// primary mechanism is the `siteSettings` cache tag, which the /api/revalidate
// webhook busts on publish (see src/sanity/queries.ts); this is the safety net.
export const revalidate = 300;

export default async function OpengraphImage() {
  const settings = await getSiteSettings();

  // Editor-uploaded default card — crop to the OG frame around the hotspot.
  // Matches the per-project OG route idiom (urlFor → <img> in an ImageResponse),
  // so the output is a 1200×630 PNG regardless of the source format.
  if (settings?.ogImage?.asset) {
    const ogUrl = urlFor(settings.ogImage)
      .width(size.width)
      .height(size.height)
      .fit("crop")
      .url();

    return new ImageResponse(
      (
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
          <img
            src={ogUrl}
            width={size.width}
            height={size.height}
            style={{ objectFit: "cover" }}
            alt=""
          />
        </div>
      ),
      { ...size },
    );
  }

  // Fallback — generated branded card. Echoes the site frame.
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
          justifyContent: "space-between",
          padding: "90px",
        }}
      >
        <div style={{ fontSize: 40, color: "rgba(255,255,255,0.7)" }}>
          {siteRole}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{ fontSize: 132, fontWeight: 700, letterSpacing: "-0.03em" }}
          >
            {siteName}
          </div>
          <div
            style={{
              fontSize: 34,
              color: "rgba(255,255,255,0.4)",
              marginTop: 16,
            }}
          >
            aledpritchard.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
