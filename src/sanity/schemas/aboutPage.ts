import { defineArrayMember, defineField, defineType } from "sanity";

// Singleton — see structure.ts and sanity.config.ts for the one-document constraint.
export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      description: "The bio paragraphs shown on the About page.",
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
    defineField({
      name: "experienceItems",
      title: "Experience",
      type: "array",
      of: [defineArrayMember({ type: "experienceItem" })],
    }),
    defineField({
      name: "advisoryItems",
      title: "Advisory",
      type: "array",
      of: [defineArrayMember({ type: "experienceItem" })],
    }),
  ],
  preview: {
    prepare() {
      return { title: "About Page" };
    },
  },
});
