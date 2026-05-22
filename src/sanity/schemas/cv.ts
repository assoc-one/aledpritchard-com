import { defineField, defineType } from "sanity";

// Singleton — see structure.ts and sanity.config.ts for the one-document constraint.
// MVP: a downloadable PDF plus light structured fields for the /cv route.
// A fully structured CV (portable text + experience array) is future work.
export const cv = defineType({
  name: "cv",
  title: "CV",
  type: "document",
  fields: [
    defineField({
      name: "pdfFile",
      title: "PDF file",
      type: "file",
      description: "The downloadable CV.",
      options: { accept: ".pdf" },
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: "Shown at the top of the /cv route.",
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
      description: "Short introduction shown above the CV download on the web page.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "CV" };
    },
  },
});
