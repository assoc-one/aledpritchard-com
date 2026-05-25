import { ImageResponse } from "next/og";

import { FALLBACK_ICON_BG, FALLBACK_ICON_FG, FALLBACK_ICON_LETTER, FALLBACK_ICON_SVG } from "@/lib/fallback-icon";
import { getSiteSettings } from "@/sanity/queries";

// Browser tab favicon. Sources the mark from `siteSettings.icon` in Sanity so
// it can be swapped without a redeploy. Falls back to the bundled mark when
// the field is unset.
//
// Cache: revalidate every 60s so a Studio upload propagates without a deploy
// (chosen per COS-154 — matches the site-wide 60s ISR window from COS-140).
export const revalidate = 60;

export const size = { width: 32, height: 32 };

// `contentType` here drives the <link rel="icon" type="..."> hint in <head>.
// Most uploads are PNG so that's the safe default; for SVG passthrough the
// actual Response header (set below) is what browsers use to render.
export const contentType = "image/png";

export default async function Icon() {
  const settings = await getSiteSettings();
  const asset = settings?.icon?.asset;

  // 1. No upload: serve the bundled fallback SVG verbatim.
  if (!asset?.url) {
    return new Response(FALLBACK_ICON_SVG, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  }

  const isSvg = asset.mimeType === "image/svg+xml" || asset.extension === "svg";

  // 2. SVG upload: passthrough raw bytes from Sanity.
  if (isSvg) {
    const upstream = await fetch(asset.url, { next: { revalidate } });
    if (!upstream.ok) {
      // Sanity hiccup — fall back to the bundled mark rather than 5xx.
      return new Response(FALLBACK_ICON_SVG, {
        headers: { "Content-Type": "image/svg+xml" },
      });
    }
    const svg = await upstream.text();
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  }

  // 3. Raster upload: rasterize to a 32×32 PNG via next/og. We render the
  // Sanity image (resized server-side via the image URL) inside an
  // ImageResponse so the output matches the standard favicon size regardless
  // of upload dimensions.
  const src = `${asset.url}?w=64&h=64&fit=crop&auto=format`;
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: FALLBACK_ICON_BG,
          color: FALLBACK_ICON_FG,
          alignItems: "center",
          justifyContent: "center",
          fontSize: 25,
          fontWeight: 700,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={32} height={32} alt={FALLBACK_ICON_LETTER} />
      </div>
    ),
    { ...size },
  );
}
