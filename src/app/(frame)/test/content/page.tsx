import {
  getAboutPage,
  getAllArticles,
  getAllProjects,
  getArticleBySlug,
  getContactPage,
  getProjectBySlug,
  getSiteSettings,
} from "@/sanity/queries";

// Debug route for COS-139 — renders every Sanity query as raw JSON so the
// content layer can be verified before any real UI consumes it. Rendered
// per-request so it reflects the current state of the dataset.
export const dynamic = "force-dynamic";

function Section({ title, data }: { title: string; data: unknown }) {
  return (
    <section className="mb-8">
      <h2 className="mb-2 text-text-white">{title}</h2>
      <pre className="overflow-x-auto border border-text-white-40 p-4 text-[13px] leading-relaxed text-text-white-70">
        {JSON.stringify(data, null, 2)}
      </pre>
    </section>
  );
}

export default async function TestContentPage() {
  const [projects, articles, about, contact, settings] = await Promise.all([
    getAllProjects(),
    getAllArticles(),
    getAboutPage(),
    getContactPage(),
    getSiteSettings(),
  ]);

  const firstProjectSlug = projects[0]?.slug ?? null;
  const firstArticleSlug = articles[0]?.slug ?? null;
  const firstProject = firstProjectSlug
    ? await getProjectBySlug(firstProjectSlug)
    : null;
  const firstArticle = firstArticleSlug
    ? await getArticleBySlug(firstArticleSlug)
    : null;

  return (
    <main className="min-h-screen overflow-y-auto py-[var(--frame-edge)] pl-[calc(var(--frame-col-details)_+_var(--frame-col-list))] pr-[var(--frame-edge)]">
      <h1 className="mb-2 text-text-white">Content debug</h1>
      <p className="mb-8 max-w-[520px] text-text-white-40">
        COS-139 — every Sanity query rendered as raw JSON. A null or empty
        section means that content has not been seeded in Studio yet.
      </p>

      <Section title="getAllProjects()" data={projects} />
      <Section
        title={`getProjectBySlug("${firstProjectSlug ?? "—"}")`}
        data={firstProject}
      />
      <Section title="getAllArticles()" data={articles} />
      <Section
        title={`getArticleBySlug("${firstArticleSlug ?? "—"}")`}
        data={firstArticle}
      />
      <Section title="getAboutPage()" data={about} />
      <Section title="getContactPage()" data={contact} />
      <Section title="getSiteSettings()" data={settings} />
    </main>
  );
}
