import { client } from "@/sanity/client";

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{ taglineDefault }`;

export const revalidate = 10;

type SiteSettings = {
  taglineDefault?: string;
};

export default async function Home() {
  const settings = await client.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY);

  return (
    <p className="fixed left-[var(--frame-col-details)] top-[50vh] z-10 max-w-[280px] -translate-y-1/2 text-body text-text-white">
      {settings?.taglineDefault ?? "No tagline found in Sanity."}
    </p>
  );
}
