import type { Metadata } from "next";

// Canonical site identity. The apex is the canonical host (COS-144) —
// www.aledpritchard.com redirects to it.
export const siteUrl = "https://aledpritchard.com";

export const siteName = "Aled Pritchard";

// Role label, as shown in the site frame.
export const siteRole = "Design Director";

// Fallback meta description. Site Settings → "Meta description" in Studio
// overrides this once written.
export const siteDescription =
  "Selected work and writing by Aled Pritchard, Design Director.";

// Per-page metadata builder — sets the title, description, canonical URL, and
// the matching Open Graph fields from a single call. The root layout supplies
// the title template and og:image, so callers pass the bare page title.
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      title: `${opts.title} — ${siteName}`,
      description: opts.description,
      url: `${siteUrl}${opts.path}`,
    },
    twitter: {
      title: `${opts.title} — ${siteName}`,
      description: opts.description,
    },
  };
}
