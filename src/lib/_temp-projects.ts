// Placeholder project data for COS-138. The Sanity content model (COS-139)
// replaces this. Only slug, title, and slide count are needed to drive the
// navigation state machine — real images and slide data arrive in COS-140.

export interface TempProject {
  slug: string;
  title: string;
  slides: number;
}

export const TEMP_PROJECTS: TempProject[] = [
  { slug: "jpmc", title: "JPMorgan Chase", slides: 3 },
  { slug: "wallpaper", title: "Wallpaper*", slides: 3 },
  { slug: "bud", title: "Bud", slides: 1 },
];

export function projectIndexForSlug(slug: string): number {
  return TEMP_PROJECTS.findIndex((p) => p.slug === slug);
}
