import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import type { ALL_ARTICLES_QUERY_RESULT } from "@/sanity/types.gen";

import { WritingIndex } from "./WritingIndex";

const mockArticles: ALL_ARTICLES_QUERY_RESULT = [
  {
    _id: "a1",
    _type: "article",
    title: "Clarity, direction, momentum",
    slug: "clarity-direction-momentum",
    lede: "Three checks I run on every team I lead — and how I keep them visible week to week.",
    publishedAt: "2026-04-12T00:00:00Z",
    featured: true,
  },
  {
    _id: "a2",
    _type: "article",
    title: "Designing for ambiguity",
    slug: "designing-for-ambiguity",
    lede: "What it means to lead design when the brief is still being written.",
    publishedAt: "2026-02-08T00:00:00Z",
    featured: false,
  },
  {
    _id: "a3",
    _type: "article",
    title: "Notes on early-stage product reviews",
    slug: "early-stage-product-reviews",
    lede: "A lightweight ritual that surfaces the right kind of feedback at the right moment.",
    publishedAt: "2025-11-30T00:00:00Z",
    featured: false,
  },
];

const meta: Meta<typeof WritingIndex> = {
  title: "Writing/WritingIndex",
  component: WritingIndex,
  // Writing index renders on the light canvas in production.
  globals: { canvas: "light" },
};
export default meta;

type Story = StoryObj<typeof WritingIndex>;

// Pre-publish / empty dataset → "No articles published yet."
export const Empty: Story = {
  args: { articles: [] },
};

// Populated list — each row is a real link, no dates per the prototype.
export const Populated: Story = {
  args: { articles: mockArticles },
};
