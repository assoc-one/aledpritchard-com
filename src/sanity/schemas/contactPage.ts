import { defineArrayMember, defineField, defineType } from "sanity";

// Singleton — see structure.ts and sanity.config.ts for the one-document constraint.
export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({
      name: "letsTalkHeading",
      title: "\"Let's talk\" heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "letsTalkDescription",
      title: "\"Let's talk\" description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
    }),
    defineField({
      name: "subjectOptions",
      title: "Subject options",
      type: "array",
      description: "Options for the contact form's subject dropdown.",
      of: [defineArrayMember({ type: "subjectOption" })],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Contact Page" };
    },
  },
});
