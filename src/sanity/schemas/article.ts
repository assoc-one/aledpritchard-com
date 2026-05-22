import { defineArrayMember, defineField, defineType } from "sanity";

export const article = defineType({
  name: "article",
  title: "Article",
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
      description: "Used in the URL: /writing/[slug]",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lede",
      title: "Lede",
      type: "text",
      rows: 2,
      description: "One or two sentences shown in the writing index.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Subheading", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
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
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      description: "Controls live status and default ordering (reverse-chronological).",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Manual order",
      type: "number",
      description:
        "Optional. When set, overrides reverse-chronological ordering — lower numbers appear first.",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Surface this article on the homepage / future placements.",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Published, newest first",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "lede" },
  },
});
