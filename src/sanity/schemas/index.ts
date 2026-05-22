import type { SchemaTypeDefinition } from "sanity";

import { aboutPage } from "./aboutPage";
import { article } from "./article";
import { contactPage } from "./contactPage";
import { cv } from "./cv";
import { experienceItem } from "./experienceItem";
import { project } from "./project";
import { siteSettings } from "./siteSettings";
import { slide } from "./slide";
import { subjectOption } from "./subjectOption";

// Document types and the object types they compose. Order here drives the
// default order of the "Create new" menu in Studio.
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    project,
    article,
    aboutPage,
    contactPage,
    cv,
    siteSettings,
    // Objects
    slide,
    experienceItem,
    subjectOption,
  ],
};
