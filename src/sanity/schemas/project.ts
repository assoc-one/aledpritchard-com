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
      description: "Shown in the project cover state. Drag the hotspot to set the focal point.",
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
      description: "Short description. Not yet surfaced — reserved for future use.",
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
