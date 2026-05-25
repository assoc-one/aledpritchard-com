import { ContactForm } from "@/components/contact/ContactForm";
import { ContactLinks } from "@/components/contact/ContactLinks";
import { ContactMode } from "@/components/contact/ContactMode";
import { pageMetadata } from "@/lib/site";
import { getContactPage } from "@/sanity/queries";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with Aled Pritchard.",
  path: "/contact",
});

// Contact page — form on top, contact links anchored to the bottom of the
// column so the last link sits level with the Menu toggle.
export default async function ContactPage() {
  const contact = await getContactPage();

  const subjectOptions = (contact?.subjectOptions ?? []).flatMap((option) =>
    option.value && option.label
      ? [{ value: option.value, label: option.label }]
      : [],
  );

  return (
    <>
      <ContactMode />
      <main className="h-screen overflow-y-auto pl-[calc(var(--frame-col-details)+var(--frame-col-list))]">
        <h1 className="sr-only">Contact</h1>
        <div className="flex min-h-full flex-col p-[var(--frame-edge)]">
          <div className="max-w-[522px]">
            <ContactForm
              heading={contact?.letsTalkHeading ?? "Let's talk"}
              description={contact?.letsTalkDescription ?? ""}
              subjectOptions={subjectOptions}
            />
          </div>
          <div className="mt-auto max-w-[522px] pt-16">
            <ContactLinks
              email={contact?.email ?? "hello@aledpritchard.com"}
              instagramUrl={contact?.instagramUrl ?? null}
              linkedinUrl={contact?.linkedinUrl ?? null}
            />
          </div>
        </div>
      </main>
    </>
  );
}
