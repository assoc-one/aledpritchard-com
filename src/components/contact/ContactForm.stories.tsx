import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ContactForm } from "./ContactForm";

const subjectOptions = [
  { value: "work", label: "Work enquiry" },
  { value: "advisory", label: "Advisory" },
  { value: "press", label: "Press / writing" },
  { value: "other", label: "Other" },
];

const meta: Meta<typeof ContactForm> = {
  title: "Contact/ContactForm",
  component: ContactForm,
  globals: { canvas: "light" },
  args: {
    heading: "Let's talk.",
    description:
      "Drop a note — I read every message and aim to reply within a couple of days.",
    subjectOptions,
  },
};
export default meta;

type Story = StoryObj<typeof ContactForm>;

// Default render — the form before any interaction. Submission state
// (submitting / success / error) is driven by an internal `useState` plus a
// `fetch` call to `/api/contact`; faithful stories for those would require
// fetch mocking and are deferred to a follow-up (Chromatic, COS-159, or
// component testing infra). Validation errors render via the play-time
// submit path but that requires `@storybook/test`, which isn't installed.
export const Idle: Story = {};
