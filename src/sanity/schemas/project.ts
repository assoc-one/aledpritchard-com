import { defineArrayMember, defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Used in the URL: /work/[slug]",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cover",
      title: "Cover image",
      type: "image",
      description:
        "Full-bleed background shown in the project cover state. Recommended landscape, ~2560×1440px (16:9). Drag the hotspot to set the focal point.",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slides",
      title: "Slides",
      type: "array",
      description: "Ordered image sequence shown after the cover.",
      of: [defineArrayMember({ type: "slide" })],
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Position in the project list — lower numbers appear first.",
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description:
        "SEO / social description — used for the project's <meta> and Open Graph tags. Distinct from the Overview body below.",
    }),
    defineField({
      name: "overview",
      title: "Overview (intro state)",
      type: "object",
      description:
        "Optional editorial content shown on the project's intro state, between cover and first slide. Leave empty to skip the intro state entirely.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule) => rule.required().error("Title is required if overview is set"),
        }),
        defineField({
          name: "subtitle",
          title: "Subtitle",
          type: "string",
        }),
        defineField({
          name: "meta",
          title: "Meta",
          type: "array",
          description:
            "Short label/value pairs shown under the subtitle (e.g. Role / Design Director, Company / JPMorgan Chase, Year / 2022—2024).",
          of: [
            defineArrayMember({
              type: "object",
              name: "metaItem",
              fields: [
                defineField({
                  name: "label",
                  title: "Label",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "value",
                  title: "Value",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
              ],
              preview: {
                select: { label: "label", value: "value" },
                prepare({ label, value }) {
                  return { title: value || "—", subtitle: label || "" };
                },
              },
            }),
          ],
        }),
        defineField({
          name: "body",
          title: "Body",
          type: "array",
          description: "Short paragraphs. Keep snappy — depth belongs in the article.",
          of: [
            defineArrayMember({
              type: "block",
              styles: [{ title: "Normal", value: "normal" }],
              lists: [],
              marks: {
                decorators: [
                  { title: "Strong", value: "strong" },
                  { title: "Emphasis", value: "em" },
                ],
                annotations: [],
              },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "metadata",
      title: "Case-study metadata",
      type: "object",
      description: "Optional — reserved for future case-study detail.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "stage", title: "Stage", type: "string" }),
        defineField({ name: "duration", title: "Duration", type: "string" }),
        defineField({ name: "teamSize", title: "Team size", type: "string" }),
        defineField({ name: "role", title: "Role", type: "string" }),
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      description: "Controls live status — a future date hides the project.",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "List order",
      name: "listOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", media: "cover", order: "order" },
    prepare({ title, media, order }) {
      return {
        title: title || "Untitled project",
        subtitle: typeof order === "number" ? `Order ${order}` : "No order set",
        media,
      };
    },
  },
});
