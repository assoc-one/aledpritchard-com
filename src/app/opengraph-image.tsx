import { ImageResponse } from "next/og";

import { siteName, siteRole } from "@/lib/site";

// Default branded social-share card — used for every route without a more
// specific opengraph-image. Echoes the site frame: muted role above the name.
export const alt = `${siteName} — ${siteRole}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
