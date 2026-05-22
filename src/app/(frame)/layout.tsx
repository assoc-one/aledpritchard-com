import { FrameShell } from "@/components/frame/FrameShell";
import { getAllProjects, getSiteSettings } from "@/sanity/queries";

// Server layout for the framed routes — fetches the project list and site
// settings (60s ISR) and hands them to the client FrameShell.
export default async function FrameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [projects, settings] = await Promise.all([
    getAllProjects(),
    getSiteSettings(),
  ]);

  return (
    <FrameShell projects={projects} tagline={settings?.taglineDefault ?? ""}>
      {children}
    </FrameShell>
  );
}
