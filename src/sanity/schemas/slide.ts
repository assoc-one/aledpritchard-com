import { defineField, defineType } from "sanity";

// A single image within a project's slide sequence. `full` is full-bleed;
// `fit` is bounded to the right meta column (see COS-140 slide rendering).
export const slide = defineType({
  name: "slide",
  title: "Slide",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      options: {
        list: [
          { title: "Full bleed", value: "full" },
          { title: "Fill (cover, cropped to right column)", value: "fill" },
          { title: "Fit (right column)", value: "fit" },
        ],
        layout: "radio",
      },
      initialValue: "full",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
  ],
  preview: {
    select: { media: "image", caption: "caption", variant: "variant" },
    prepare({ media, caption, variant }) {
      return {
        media,
        title: caption || "Slide",
        subtitle:
          variant === "fit" ? "Fit" : variant === "fill" ? "Fill" : "Full bleed",
      };
    },
  },
});
