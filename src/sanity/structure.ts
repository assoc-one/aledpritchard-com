import type { StructureResolver } from "sanity/structure";

// siteSettings is a singleton: edited as one fixed document, not a list.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings"),
        ),
    ]);
