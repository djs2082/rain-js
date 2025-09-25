import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Button } from "./Button";
import { ToastProvider, useToast } from "./ToastProvider";
import { ToastThemeProvider } from "../theme/toastProvider";

const meta: Meta<typeof ToastProvider> = {
  title: "Components/Toast/Documentation",
  component: ToastProvider,
  subcomponents: { ToastThemeProvider },
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Toasts show transient messages. Use ToastProvider to expose a show/hide API via the useToast hook. Supports success/error/info/warning variants, durations, placement, width/height, and responsive behavior.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function DemoBasic() {
  const { show, clear } = useToast();
  return (
    <div style={{ padding: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Button onClick={() => show("Saved successfully!", { variant: "success" })}>Success</Button>
      <Button onClick={() => show("Something went wrong", { variant: "error" })}>Error</Button>
      <Button onClick={() => show("Heads up, check this out", { variant: "info" })}>Info</Button>
      <Button onClick={() => show("Be careful with this action", { variant: "warning" })}>Warning</Button>
      <Button variant="text" onClick={() => clear()}>Clear</Button>
    </div>
  );
}

export const Basic: Story = {
  render: () => (
    <ToastThemeProvider>
      <ToastProvider>
        <DemoBasic />
      </ToastProvider>
    </ToastThemeProvider>
  ),
};

function DemoOptions() {
  const { show } = useToast();
  return (
    <div style={{ padding: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Button onClick={() => show("Wide toast (5s)", { duration: 5000, width: 420 })}>Wide + 5s</Button>
      <Button onClick={() => show("Tall toast", { height: 80 })}>Tall</Button>
    </div>
  );
}

export const Customization: Story = {
  render: () => (
    <ToastThemeProvider>
      <ToastProvider placement="bottom-center">
        <DemoOptions />
      </ToastProvider>
    </ToastThemeProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: "Override placement per provider instance and control width/height/duration per toast.",
      },
    },
  },
};

export const Themed: Story = {
  render: () => (
    <ToastThemeProvider
      theme={{
        container: { placement: "bottom-right", edgeOffset: 24, gap: 12, mobileBreakpoint: 640 },
        toast: { borderRadius: "10px", padding: "12px 14px", maxWidth: 440, fontSize: "15px" },
        variants: {
          success: { background: "#065f46", color: "#d1fae5" },
          error: { background: "#7f1d1d", color: "#fee2e2" },
          info: { background: "#1e3a8a", color: "#dbeafe" },
          warning: { background: "#7c2d12", color: "#ffedd5" },
        },
        durations: { default: 4000 },
      }}
    >
      <ToastProvider>
        <DemoBasic />
      </ToastProvider>
    </ToastThemeProvider>
  ),
};
