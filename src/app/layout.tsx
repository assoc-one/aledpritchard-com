import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import { siteDescription, siteName, siteUrl } from "@/lib/site";
import { getSiteSettings } from "@/sanity/queries";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const description = settings?.metaDescription?.trim() || siteDescription;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteName,
      template: `%s — ${siteName}`,
    },
    description,
    applicationName: siteName,
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    openGraph: {
      type: "website",
      siteName,
      url: siteUrl,
      title: siteName,
      description,
      locale: "en_GB",
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={schibstedGrotesk.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
