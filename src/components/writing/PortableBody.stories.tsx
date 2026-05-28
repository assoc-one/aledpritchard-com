import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PortableBody } from "./PortableBody";

// A minimal but realistic Portable Text block sequence covering each style
// the rendering layer supports (h2, h3, normal, blockquote, list).
const mockBlocks = [
  {
    _type: "block",
    _key: "b1",
    style: "h2",
    markDefs: [],
    children: [{ _type: "span", _key: "s1", text: "A short article", marks: [] }],
  },
  {
    _type: "block",
    _key: "b2",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "s2",
        text: "Portable text renders rich content from Sanity. Bold and italic marks both work.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "b3",
    style: "h3",
    markDefs: [],
    children: [{ _type: "span", _key: "s3", text: "A subhead", marks: [] }],
  },
  {
    _type: "block",
    _key: "b4",
    style: "blockquote",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "s4",
        text: "A pulled quote, set apart from the body.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "b5",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [{ _type: "span", _key: "s5", text: "First bullet", marks: [] }],
  },
  {
    _type: "block",
    _key: "b6",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [{ _type: "span", _key: "s6", text: "Second bullet", marks: [] }],
  },
];

const meta: Meta<typeof PortableBody> = {
  title: "Writing/PortableBody",
  component: PortableBody,
  // Article copy renders against the light canvas in production.
  globals: { canvas: "light" },
};
export default meta;

type Story = StoryObj<typeof PortableBody>;

// `null` or `[]` → renders nothing.
export const Empty: Story = {
  args: { value: null },
};

// Block sequence covering each supported style.
export const WithBlocks: Story = {
  args: { value: mockBlocks },
};
