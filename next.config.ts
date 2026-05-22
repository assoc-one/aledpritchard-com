import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sanity's image CDN — covers, slides, and other asset images.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
