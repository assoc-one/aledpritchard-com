import type { NextConfig } from "next";

// Content Security Policy applied site-wide, served in report-only mode for
// the first rollout so we can observe violations without breaking the site.
// Flip the response header key from `Content-Security-Policy-Report-Only` to
// `Content-Security-Policy` after a clean reporting window (see COS-165).
//
// `/studio` is intentionally excluded — the embedded Sanity Studio is a heavy
// SPA whose runtime behaviour (dynamic eval, inline scripts, third-party
// origins) doesn't fit a tight CSP. Locking it down is a separate workstream.
const contentSecurityPolicy = [
  "default-src 'self'",
  "img-src 'self' data: https://cdn.sanity.io",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "font-src 'self' data:",
  "connect-src 'self' https://cdn.sanity.io https://*.vercel-insights.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

// Security headers applied to every route, including `/studio`. These don't
// interfere with the embedded Studio.
const baselineSecurityHeaders = [
  // HSTS without `preload` for now — preloading is effectively irreversible
  // via the HSTS preload list and is gated on Aled's explicit decision
  // (COS-165). Two-year max-age with subdomain coverage.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  // Cross-Origin-Opener-Policy isolates this top-level window from pop-ups
  // and cross-origin contexts.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // X-Frame-Options is technically superseded by CSP `frame-ancestors`, but
  // older browsers honour it and CSP is report-only initially, so keep both.
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send origin only on cross-origin navigations; full URL on same-origin.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Tight default — opt in to specific features per route if we ever need
  // them (we don't today).
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    // Sanity's image CDN — covers, slides, and other asset images.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async headers() {
    return [
      // Baseline security headers everywhere, including /studio.
      {
        source: "/:path*",
        headers: baselineSecurityHeaders,
      },
      // CSP in report-only mode for everything except /studio. Use a regex
      // negative-lookahead so the matcher excludes any path under /studio
      // while still matching the root path.
      {
        source: "/:path((?!studio).*)",
        headers: [
          {
            key: "Content-Security-Policy-Report-Only",
            value: contentSecurityPolicy,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
