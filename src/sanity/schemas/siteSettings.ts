import { defineField, defineType } from "sanity";

// Singleton — see structure.ts and sanity.config.ts for the one-document constraint.
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "taglineDefault",
      title: "Default tagline",
      type: "string",
      description: "Replaces the placeholder tagline once written.",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 2,
      description: "Default page meta description.",
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph image",
      type: "image",
      description: "Default social-share image.",
      options: { hotspot: true },
    }),
    defineField({
      name: "icon",
      title: "Site icon",
      type: "image",
      description:
        "Single source for the browser tab favicon, Apple touch icon, and PWA manifest icon. Accepts PNG or SVG. If unset, the bundled fallback mark is used.",
      options: { accept: "image/png,image/svg+xml" },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Optional — used by assistive tech.",
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
