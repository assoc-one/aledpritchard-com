import { defineField, defineType } from "sanity";

// One selectable option in the Contact form's subject dropdown.
export const subjectOption = defineType({
  name: "subjectOption",
  title: "Subject option",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "Shown to the visitor in the dropdown.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      description: "Submitted with the form / used in the email subject.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "value" },
  },
});
