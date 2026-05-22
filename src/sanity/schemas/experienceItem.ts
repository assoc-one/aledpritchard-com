import { defineField, defineType } from "sanity";

// One row in the About page's Experience or Advisory lists.
export const experienceItem = defineType({
  name: "experienceItem",
  title: "Experience item",
  type: "object",
  fields: [
    defineField({
      name: "roleTitle",
      title: "Role title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "dates",
      title: "Dates",
      type: "string",
      description: 'Free text, e.g. "2022–2025" or "2024–present".',
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "roleTitle", dates: "dates", description: "description" },
    prepare({ title, dates, description }) {
      return {
        title: title || "Untitled role",
        subtitle: [dates, description].filter(Boolean).join(" — "),
      };
    },
  },
});
