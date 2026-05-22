import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";

import type { ARTICLE_BY_SLUG_QUERY_RESULT } from "@/sanity/types.gen";

type ArticleBody = NonNullable<ARTICLE_BY_SLUG_QUERY_RESULT>["body"];

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-5 leading-[1.6] text-text-dark">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-3 mt-10 text-[1.5rem] font-bold leading-tight text-text-dark">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-8 text-[1.15rem] font-bold leading-tight text-text-dark">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-text-dark-40 pl-4 text-text-dark-70">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 list-disc pl-5 leading-[1.6] text-text-dark">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 list-decimal pl-5 leading-[1.6] text-text-dark">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-1">{children}</li>,
    number: ({ children }) => <li className="mb-1">{children}</li>,
  },
};

// Renders an article's portable text body. The generated body type and
// @portabletext/react's input type diverge only on `markDefs` nullability,
// so the value is cast at this single boundary.
export function PortableBody({ value }: { value: ArticleBody }) {
  if (!value || value.length === 0) return null;
  return (
    <PortableText
      value={value as unknown as PortableTextBlock[]}
      components={components}
    />
  );
}
