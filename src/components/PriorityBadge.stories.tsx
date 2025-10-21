import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import PriorityBadge from "./PriorityBadge";
import { PriorityBadgeThemeProvider } from "../theme/priority/provider";

const meta: Meta<typeof PriorityBadge> = {
  title: "Components/PriorityBadge",
  component: PriorityBadge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Theme-based badge to indicate priority levels. Consume PriorityBadgeThemeProvider to override colors, sizes, and dot behavior per variant.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PriorityBadge>;

export const Basic: Story = {
  render: () => (
    <PriorityBadgeThemeProvider>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <PriorityBadge priority="low" />
        <PriorityBadge priority="medium" />
        <PriorityBadge priority="high" />
      </div>
    </PriorityBadgeThemeProvider>
  ),
};

export const WithDot: Story = {
  render: () => (
    <PriorityBadgeThemeProvider>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <PriorityBadge priority="low" showDot />
        <PriorityBadge priority="medium" showDot />
        <PriorityBadge priority="high" showDot />
      </div>
    </PriorityBadgeThemeProvider>
  ),
};

export const BlinkingDot: Story = {
  render: () => (
    <PriorityBadgeThemeProvider>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <PriorityBadge priority="low" showDot blinkDot />
        <PriorityBadge priority="medium" showDot blinkDot />
        <PriorityBadge priority="high" showDot blinkDot />
      </div>
    </PriorityBadgeThemeProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: "Blinking uses a CSS keyframes animation with a theme-configurable duration and opacity.",
      },
    },
  },
};

export const Themed: Story = {
  render: () => (
    <PriorityBadgeThemeProvider
      theme={{
        badge: { fontSize: "0.8rem", padding: "3px 10px", borderRadius: 6, fontWeight: 700, gap: 8 },
        dot: { size: 8, blinkDurationMs: 900, opacity: 0.6 },
        variants: {
          low: { background: "#155e75", color: "#e0f2fe" },
          medium: { background: "#6b21a8", color: "#f3e8ff" },
          high: { background: "#7f1d1d", color: "#fee2e2" },
        },
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <PriorityBadge priority="low" showDot blinkDot />
        <PriorityBadge priority="medium" showDot blinkDot />
        <PriorityBadge priority="high" showDot blinkDot />
      </div>
    </PriorityBadgeThemeProvider>
  ),
};

export const CustomLabels: Story = {
  render: () => (
    <PriorityBadgeThemeProvider>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <PriorityBadge priority="low" label="Low Priority" />
        <PriorityBadge priority="medium" label="Medium Priority" />
        <PriorityBadge priority="high" label="High Priority" />
      </div>
    </PriorityBadgeThemeProvider>
  ),
};
