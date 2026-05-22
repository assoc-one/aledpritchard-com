import type { StructureBuilder, StructureResolver } from "sanity/structure";

// Document types edited as a single fixed document rather than a list.
// The one-document constraint is also enforced in sanity.config.ts (the
// global "Create" menu and duplicate/delete actions are filtered).
export const SINGLETON_TYPES = [
  "aboutPage",
  "contactPage",
  "cv",
  "siteSettings",
] as const;

function singletonItem(S: StructureBuilder, schemaType: string, title: string) {
  return S.listItem()
    .title(title)
    .id(schemaType)
    .child(S.document().schemaType(schemaType).documentId(schemaType));
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("article").title("Articles"),
      S.divider(),
      singletonItem(S, "aboutPage", "About Page"),
      singletonItem(S, "contactPage", "Contact Page"),
      singletonItem(S, "cv", "CV"),
      singletonItem(S, "siteSettings", "Site Settings"),
    ]);
