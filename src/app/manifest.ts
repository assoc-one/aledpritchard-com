import type { MetadataRoute } from "next";

import { siteDescription, siteName } from "@/lib/site";

// Served at /manifest.webmanifest.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: siteName,
    description: siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    // Icons are served by the dynamic routes in src/app/icon.tsx and
    // src/app/apple-icon.tsx — both source the mark from
    // `siteSettings.icon` in Sanity (COS-154). The MIME `image/png` is the
    // common case; SVG uploads passthrough at the route level and browsers
    // read the actual Content-Type response header rather than this hint.
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
