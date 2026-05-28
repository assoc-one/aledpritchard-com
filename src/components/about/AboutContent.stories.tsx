import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import type { ABOUT_PAGE_QUERY_RESULT } from "@/sanity/types.gen";

import { AboutContent } from "./AboutContent";

type AboutPage = NonNullable<ABOUT_PAGE_QUERY_RESULT>;

const mockBio: AboutPage["bio"] = [
  {
    _type: "block",
    _key: "b1",
    style: "normal",
    markDefs: null,
    children: [
      {
        _type: "span",
        _key: "s1",
        text: "Design director with 15 years building product, content, and brand systems for finance, publishing, and consumer technology.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "b2",
    style: "normal",
    markDefs: null,
    children: [
      {
        _type: "span",
        _key: "s2",
        text: "Currently exploring tools that help small design teams operate like much larger ones.",
        marks: [],
      },
    ],
  },
];

const mockExperience: AboutPage["experienceItems"] = [
  {
    _key: "e1",
    _type: "experienceItem",
    roleTitle: "Design Director, JPMorgan Chase",
    dates: "2022 — Present",
    description: "Leading design for the firm's institutional digital banking platform.",
  },
  {
    _key: "e2",
    _type: "experienceItem",
    roleTitle: "Senior Product Designer, Wallpaper*",
    dates: "2018 — 2022",
    description: "Brand and product design across the magazine's digital surfaces.",
  },
];

const mockAdvisory: AboutPage["advisoryItems"] = [
  {
    _key: "a1",
    _type: "experienceItem",
    roleTitle: "Design Advisor, Bud",
    dates: "2023 — Present",
    description: "Quarterly design strategy reviews with the founding team.",
  },
];

const meta: Meta<typeof AboutContent> = {
  title: "About/AboutContent",
  component: AboutContent,
  // About content renders on the light canvas in production.
  globals: { canvas: "light" },
};
export default meta;

type Story = StoryObj<typeof AboutContent>;

// Pre-publish / Sanity returned null → "About content coming soon."
export const Empty: Story = {
  args: { about: null },
};

// Bio set, no experience or advisory.
export const WithBio: Story = {
  args: {
    about: {
      _id: "about",
      _type: "aboutPage",
      bio: mockBio,
      experienceItems: null,
      advisoryItems: null,
    },
  },
};

// Bio + Experience + Advisory all populated — the production layout.
export const Full: Story = {
  args: {
    about: {
      _id: "about",
      _type: "aboutPage",
      bio: mockBio,
      experienceItems: mockExperience,
      advisoryItems: mockAdvisory,
    },
  },
};
