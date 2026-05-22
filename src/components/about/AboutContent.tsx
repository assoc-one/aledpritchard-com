import { PortableBody } from "@/components/writing/PortableBody";
import type { ABOUT_PAGE_QUERY_RESULT } from "@/sanity/types.gen";

type About = NonNullable<ABOUT_PAGE_QUERY_RESULT>;
type ExperienceItem = NonNullable<About["experienceItems"]>[number];

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid grid-cols-[1fr_2.4fr] gap-12 pb-16">
      <h2 className="text-text-dark">{label}</h2>
      <div>{children}</div>
    </section>
  );
}

function ExperienceRow({
  item,
  first,
}: {
  item: ExperienceItem;
  first: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[1fr_1fr_2fr] gap-6 pb-6 ${first ? "pt-0" : "pt-6"}`}
    >
      <span className="text-text-dark">{item.roleTitle}</span>
      <span className="text-text-dark-70">{item.dates}</span>
      <span className="leading-[1.4] text-text-dark">{item.description}</span>
    </div>
  );
}

export function AboutContent({ about }: { about: About | null }) {
  if (!about) {
    return <p className="text-text-dark-70">About content coming soon.</p>;
  }

  const { bio, experienceItems, advisoryItems } = about;

  return (
    <div className="flex flex-col">
      {bio && bio.length > 0 && (
        <Section label="Bio">
          <PortableBody value={bio} />
        </Section>
      )}
      {experienceItems && experienceItems.length > 0 && (
        <Section label="Experience">
          {experienceItems.map((item, i) => (
            <ExperienceRow key={item._key} item={item} first={i === 0} />
          ))}
        </Section>
      )}
      {advisoryItems && advisoryItems.length > 0 && (
        <Section label="Advisory">
          {advisoryItems.map((item, i) => (
            <ExperienceRow key={item._key} item={item} first={i === 0} />
          ))}
        </Section>
      )}
    </div>
  );
}
