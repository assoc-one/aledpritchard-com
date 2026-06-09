import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { muxInput } from "sanity-plugin-mux-input";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemas";
import { SINGLETON_TYPES, structure } from "./src/sanity/structure";

const singletons = new Set<string>(SINGLETON_TYPES);
const lockedSingletonActions = ["duplicate", "delete"];

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
    // Registers the `mux.video` schema type + a Studio upload field that mirrors
    // the image upload UX. Tokens (MUX_TOKEN_ID / MUX_TOKEN_SECRET) are read from
    // the deployed Studio env (Vercel), not hard-coded (COS-222 / T11).
    muxInput(),
  ],
  document: {
    // Keep singletons out of the global "Create" menu so a second one
    // cannot be created. They are still editable via the structure list.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter((item) => !singletons.has(item.templateId))
        : prev,
    // Remove duplicate/delete on singletons so only one can ever exist.
    actions: (prev, { schemaType }) =>
      singletons.has(schemaType)
        ? prev.filter(
            (action) => !lockedSingletonActions.includes(action.action ?? ""),
          )
        : prev,
  },
});
