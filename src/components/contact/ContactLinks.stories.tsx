import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ContactLinks } from "./ContactLinks";

const meta: Meta<typeof ContactLinks> = {
  title: "Contact/ContactLinks",
  component: ContactLinks,
  globals: { canvas: "light" },
  args: {
    email: "aled@aledpritchard.com",
  },
};
export default meta;

type Story = StoryObj<typeof ContactLinks>;

// Only `email` set — Instagram and LinkedIn are conditional on Sanity values.
export const EmailOnly: Story = {
  args: {
    instagramUrl: null,
    linkedinUrl: null,
  },
};

// All three links present.
export const FullSocials: Story = {
  args: {
    instagramUrl: "https://instagram.com/aledpritchard",
    linkedinUrl: "https://linkedin.com/in/aledpritchard",
  },
};
