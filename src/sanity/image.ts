import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

// Build a URL for a Sanity image source (asset reference or expanded asset).
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// `object-position` value derived from an image's hotspot, so `object-cover`
// crops around the focal point set in Studio. Defaults to centre.
export function hotspotPosition(
  hotspot: { x?: number | null; y?: number | null } | null | undefined,
): string {
  const x = hotspot?.x ?? 0.5;
  const y = hotspot?.y ?? 0.5;
  return `${x * 100}% ${y * 100}%`;
}
