import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    label: "Email",
    placeholder: "Enter your email",
    variant: "outlined",
    color: "primary",
    size: "medium",
    fullWidth: false,
    error: false
  },
  argTypes: {
    variant: { control: { type: "select" }, options: ["outlined", "filled", "standard"] },
    color: { control: { type: "select" }, options: ["primary", "secondary", "success", "error", "warning", "info"] },
    size: { control: { type: "select" }, options: ["small", "medium", "large"] },
    type: { control: { type: "select" }, options: ["text", "password", "email", "number", "tel", "url", "search"] },
    error: { control: "boolean" },
    floatingLabel: { control: "boolean" },
    showPasswordToggle: { control: "boolean" },
    format: { control: "select", options: ["none", "tel", "email", "url"] },
    telPattern: { control: "text" },
    fullWidth: { control: "boolean" },
    maxChars: { control: { type: "number" } },
    showCharCount: { control: { type: "select" }, options: [false, true, "remaining"] },
    inputFilter: { control: { type: "select" }, options: [undefined, "numeric", "alpha", "alphanumeric"] }
  }
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Playground: Story = {
  args: {
    label: "Email",
    placeholder: "Enter text",
    floatingLabel: true
  }
};

export const WithHelper: Story = {
  args: { helperText: "We will never share your email." }
};

export const ErrorState: Story = {
  args: { error: true, helperText: "Invalid value." }
};

export const Password: Story = {
  args: {
    type: "password",
    label: "Password",
    placeholder: "••••••••",
    showPasswordToggle: true,
    floatingLabel: true
  }
};

export const WithAdornments: StoryObj<typeof Input> = {
  args: {
    label: "Amount",
    placeholder: "0.00",
    startAdornment: <span>$</span>,
    endAdornment: <span>USD</span>,
    variant: "outlined",
    floatingLabel: true
  }
};

export const TelMask: StoryObj<typeof Input> = {
  args: {
    label: "Phone",
    placeholder: "(555) 123-4567",
    format: "tel",
    variant: "outlined",
    floatingLabel: true
  }
};

export const EmailNormalize: StoryObj<typeof Input> = {
  args: {
    label: "Email",
    placeholder: "name@example.com",
    type: "email",
    format: "email",
    variant: "outlined",
    floatingLabel: true
  }
};

export const UrlTrim: StoryObj<typeof Input> = {
  args: {
    label: "Website",
    placeholder: "https://example.com",
    type: "url",
    format: "url",
    variant: "outlined",
    floatingLabel: true
  }
};

export const IndiaTelMask: Story = {
  args: {
    label: "Mobile",
    placeholder: "+91 1234 567",
    type: "tel",
    format: "tel",
    telPattern: "+91 xxxx xxx",
    floatingLabel: true
  }
};

export const Multiline: StoryObj<typeof Input> = {
  args: {
    label: "Description",
    placeholder: "Write a short description...",
    multiline: true,
    rows: 4,
    maxChars: 120,
    showCharCount: "remaining",
    variant: "outlined",
    floatingLabel: true
  }
};

export const WithCharCounter: StoryObj<typeof Input> = {
  args: {
    label: "Username",
    placeholder: "Up to 16 characters",
    maxChars: 16,
    showCharCount: true,
    floatingLabel: true
  }
};

export const RemainingCounter: StoryObj<typeof Input> = {
  args: {
    label: "Tag",
    placeholder: "Max 12 characters",
    maxChars: 12,
    showCharCount: "remaining",
    floatingLabel: true
  }
};

export const NumericOnly: StoryObj<typeof Input> = {
  args: {
    label: "Numeric only",
    placeholder: "Only digits",
    inputFilter: "numeric",
    floatingLabel: true
  }
};

export const AlphanumericOnly: StoryObj<typeof Input> = {
  args: {
    label: "Alphanumeric",
    placeholder: "Letters and numbers",
    inputFilter: "alphanumeric",
    floatingLabel: true
  }
};
