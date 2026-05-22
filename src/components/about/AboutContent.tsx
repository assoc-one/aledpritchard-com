import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";

import type { ABOUT_PAGE_QUERY_RESULT } from "@/sanity/types.gen";

type About = NonNullable<ABOUT_PAGE_QUERY_RESULT>;
type ExperienceItem = NonNullable<About["experienceItems"]>[number];

// Bio body copy — regular weight at 70% black, per the design.
const bioComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-normal leading-[1.4] text-text-dark-70">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-medium text-text-dark">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

// One Experience / Advisory row — role title, dates, and description. Dates
// render only when present.
function ExperienceRow({ item }: { item: ExperienceItem }) {
  return (
    <div className="flex items-start gap-8 font-normal leading-[1.4] text-text-dark-70">
      <span className="w-[240px] shrink-0">{item.roleTitle}</span>
      {item.dates && <span className="w-[110px] shrink-0">{item.dates}</span>}
      <span className="max-w-[458px] flex-1">{item.description}</span>
    </div>
  );
}

// About content — each section is a label stacked above its copy.
export function AboutContent({ about }: { about: About | null }) {
  if (!about) {
    return <p className="text-text-dark-70">About content coming soon.</p>;
  }

  const { bio, experienceItems, advisoryItems } = about;

  return (
    <div className="flex flex-col gap-16">
      {bio && bio.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-text-dark">Bio</h2>
          <div className="flex max-w-[522px] flex-col gap-3">
            <PortableText
              value={bio as unknown as PortableTextBlock[]}
              components={bioComponents}
            />
          </div>
        </section>
      )}
      {experienceItems && experienceItems.length > 0 && (
        <section className="flex flex-col gap-8">
          <h2 className="text-text-dark">Experience</h2>
          {experienceItems.map((item) => (
            <ExperienceRow key={item._key} item={item} />
          ))}
        </section>
      )}
      {advisoryItems && advisoryItems.length > 0 && (
        <section className="flex flex-col gap-8">
          <h2 className="text-text-dark">Advisory</h2>
          {advisoryItems.map((item) => (
            <ExperienceRow key={item._key} item={item} />
          ))}
        </section>
      )}
    </div>
  );
}
