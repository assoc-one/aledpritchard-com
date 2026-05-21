import { client } from "@/sanity/client";

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{ taglineDefault }`;

export const revalidate = 10;

type SiteSettings = {
  taglineDefault?: string;
};

export default async function Home() {
  const settings = await client.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-medium text-zinc-900 dark:text-zinc-100">
        {settings?.taglineDefault ?? "No tagline found in Sanity."}
      </h1>
      <a className="text-xs text-zinc-400 underline" href="/studio">
        Edit content in Sanity Studio
      </a>
    </main>
  );
}
