import { ImageResponse } from "next/og";

import { FALLBACK_ICON_BG, FALLBACK_ICON_FG, FALLBACK_ICON_LETTER } from "@/lib/fallback-icon";
import { getSiteSettings } from "@/sanity/queries";

// Apple touch icon — used by iOS "Add to Home Screen". Must be a PNG, so we
// always rasterize (SVG uploads get rasterized through Sanity's image
// pipeline). Sourced from the same `siteSettings.icon` field as the favicon.
//
// Cache: revalidate every 60s so a Studio upload propagates without a deploy
// (chosen per COS-154 — matches the site-wide 60s ISR window from COS-140).
export const revalidate = 60;

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const settings = await getSiteSettings();
  const asset = settings?.icon?.asset;

  // When an icon is uploaded, render it inside an ImageResponse. Sanity
  // rasterizes SVGs to PNG when `fm=png` is requested, so this branch works
  // for both raster and SVG uploads.
  if (asset?.url) {
    const src = `${asset.url}?w=360&h=360&fit=crop&fm=png`;
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            background: FALLBACK_ICON_BG,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={180} height={180} alt={FALLBACK_ICON_LETTER} />
        </div>
      ),
      { ...size },
    );
  }

  // Fallback — the bundled "A on black" mark, rendered fresh at 180×180 so
  // iOS gets a crisp PNG even without a Sanity upload.
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: FALLBACK_ICON_BG,
          color: FALLBACK_ICON_FG,
          fontSize: 116,
          fontWeight: 700,
        }}
      >
        {FALLBACK_ICON_LETTER}
      </div>
    ),
    { ...size },
  );
}
