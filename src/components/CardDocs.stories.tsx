import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import Card from "./Card";
import { CardThemeProvider } from "../theme/cardProvider";
import { Button } from "./Button";

const meta: Meta<typeof Card> = {
  title: "Components/Card/Documentation",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Composable, themed card with header, body, footer, optional dividers, and responsive padding.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

const header = <div>Card header</div>;
const footer = (
  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
    <Button variant="text">Cancel</Button>
    <Button color="primary">Save</Button>
  </div>
);

export const Basic: Story = {
  args: {
    header,
    children: <div>Body content goes here. Cards scale to content by default.</div>,
    footer,
  },
};

export const WithDividers: Story = {
  args: {
    header,
    children: <div>Dividers between sections improve separation.</div>,
    footer,
    showDividers: true,
  },
};

export const CustomSizing: Story = {
  args: {
    header: <div>Custom width/height + resizable</div>,
    children: (
      <div>
        Try resizing this card if your browser allows resizing. Long content will scroll when resizable is enabled and height is set.
        <p style={{ marginTop: 12 }}>Additional content for scrolling...</p>
      </div>
    ),
    footer,
    width: 520,
    height: 240,
    resizable: true,
  },
};

export const SectionHeights: Story = {
  args: {
    header: <div style={{ display: "flex", alignItems: "center" }}>Fixed header height</div>,
    children: <div>Body content</div>,
    footer: <div style={{ display: "flex", alignItems: "center" }}>Fixed footer height</div>,
    headerHeight: 64,
    footerHeight: 56,
    showDividers: true,
  },
};

export const Themed: Story = {
  render: () => (
    <CardThemeProvider
      theme={{
        container: {
          background: "#ffffff",
          color: "#111827",
          padding: "16px",
          gap: 12,
          borderRadius: "16px",
          border: "1px solid #d1d5db",
          maxWidth: 720,
          mobileBreakpoint: 640,
        },
        header: { background: "#f9fafb", fontWeight: 700 },
        footer: { background: "#f9fafb" },
        divider: { color: "#e5e7eb", thickness: "1px" },
      }}
    >
      <div style={{ padding: 16 }}>
        <Card header={<div>Profile</div>} footer={<div>Updated just now</div>}>
          <div>Name: Jane Doe</div>
          <div>Email: jane@example.com</div>
        </Card>
      </div>
    </CardThemeProvider>
  ),
};

export const WithAccent: Story = {
  args: {
    header: <div>Card with left accent</div>,
    children: <div>Hover or focus within to expand the accent rail.</div>,
    footer,
    accent: true,
    accentVariant: "primary",
  },
};

export const WithAccentAndContent: Story = {
  args: {
    header: <div>Accent reveals content</div>,
    children: <div>The accent rail expands to reveal a short label.</div>,
    footer,
    accent: true,
    accentVariant: "success",
    accentContent: <div style={{ fontSize: 12, fontWeight: 600 }}>Info</div>,
  },
};

export const AccentVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Card accent accentVariant="primary" header={<div>Primary</div>}>
        <div>Primary accent rail</div>
      </Card>
      <Card accent accentVariant="secondary" header={<div>Secondary</div>}>
        <div>Secondary accent rail</div>
      </Card>
      <Card accent accentVariant="success" header={<div>Success</div>}>
        <div>Success accent rail</div>
      </Card>
      <Card accent accentVariant="warning" header={<div>Warning</div>}>
        <div>Warning accent rail</div>
      </Card>
      <Card accent accentVariant="danger" header={<div>Danger</div>}>
        <div>Danger accent rail</div>
      </Card>
      <Card accent accentVariant="info" header={<div>Info</div>}>
        <div>Info accent rail</div>
      </Card>
    </div>
  ),
};
