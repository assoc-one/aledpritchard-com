interface ContactLink {
  label: string;
  href: string;
  external: boolean;
}

// Email / Instagram / LinkedIn — anchored to the bottom of the contact
// column. Instagram and LinkedIn render only when a URL is set in Sanity.
export function ContactLinks({
  email,
  instagramUrl,
  linkedinUrl,
}: {
  email: string;
  instagramUrl: string | null;
  linkedinUrl: string | null;
}) {
  const links: ContactLink[] = [
    { label: "Email", href: `mailto:${email}`, external: false },
    ...(instagramUrl
      ? [{ label: "Instagram", href: instagramUrl, external: true }]
      : []),
    ...(linkedinUrl
      ? [{ label: "LinkedIn", href: linkedinUrl, external: true }]
      : []),
  ];

  return (
    <div className="flex flex-col gap-4">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          {...(link.external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="group w-fit text-text-dark transition-opacity duration-[var(--duration-fast)] ease-out hover:opacity-50"
        >
          {link.label}
          <span className="ml-1.5 inline-block transition-transform duration-[var(--duration-fast)] ease-out group-hover:translate-x-1">
            →
          </span>
        </a>
      ))}
    </div>
  );
}
