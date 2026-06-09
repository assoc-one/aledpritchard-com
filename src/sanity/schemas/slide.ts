import { defineField, defineType } from "sanity";

// A single item within a project's slide sequence. Its `media` is polymorphic —
// either an image or a Mux video (set exactly one). `variant` controls layout:
// `full` is full-bleed; `fill` covers the right column (cropped); `fit` contains
// the whole media within the right column, letterboxed (see COS-140 / COS-200).
export const slide = defineType({
  name: "slide",
  title: "Slide",
  type: "object",
  fields: [
    defineField({
      name: "media",
      title: "Media",
      type: "object",
      description: "Set either an image or a video for this slide — not both.",
      fields: [
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          description:
            "Recommended ≥2000px on the longest edge. Full-bleed slides read best as landscape (~2560×1440px); Fill / Fit slides sit in the right column, so portrait or square crops suit those. Drag the hotspot to set the focal point.",
          options: { hotspot: true },
        }),
        defineField({
          name: "video",
          title: "Video",
          type: "mux.video",
          description:
            "Upload a video (hosted on Mux). Used instead of an image. Playback behaviour follows the slide variant — see the video feature spec.",
        }),
      ],
      validation: (rule) =>
        rule.custom((media?: { image?: unknown; video?: unknown }) => {
          const hasImage = Boolean(media?.image);
          const hasVideo = Boolean(media?.video);
          if (hasImage && hasVideo) {
            return "Set either an image or a video, not both.";
          }
          if (!hasImage && !hasVideo) {
            return "Add an image or a video.";
          }
          return true;
        }),
    }),
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      options: {
        list: [
          { title: "Full bleed", value: "full" },
          { title: "Fill (cover, cropped to right column)", value: "fill" },
          { title: "Fit (contain, whole image)", value: "fit" },
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
    select: {
      image: "media.image",
      videoRef: "media.video.asset._ref",
      caption: "caption",
      variant: "variant",
    },
    prepare({ image, videoRef, caption, variant }) {
      const variantLabel =
        variant === "fit"
          ? "Fit (contain)"
          : variant === "fill"
            ? "Fill"
            : "Full bleed";
      const kind = videoRef && !image ? "Video" : "Image";
      return {
        media: image,
        title: caption || "Slide",
        subtitle: `${variantLabel} · ${kind}`,
      };
    },
  },
});
