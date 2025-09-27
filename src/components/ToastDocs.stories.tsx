import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Button } from "./Button";
import { ToastContainer } from "./ToastContainer";
import { ToastThemeProvider } from "../theme/toastProvider";

const meta: Meta<typeof ToastContainer> = {
  title: "Components/Toast/Documentation",
  component: ToastContainer,
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

function DemoBasic({ onShow }: { onShow: (msg: string, opts?: any) => void }) {
  return (
    <div style={{ padding: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Button onClick={() => onShow("Saved successfully!", { variant: "success", duration: 4000 })}>Success</Button>
      <Button onClick={() => onShow("Something went wrong", { variant: "error", duration: 4000 })}>Error</Button>
      <Button onClick={() => onShow("Heads up, check this out", { variant: "info", duration: 4000 })}>Info</Button>
      <Button onClick={() => onShow("Be careful with this action", { variant: "warning", duration: 4000 })}>Warning</Button>
    </div>
  );
}

export const Basic: Story = {
  render: () => {
    const Wrapper = () => {
      const [items, setItems] = React.useState<any[]>([]);
      React.useEffect(() => () => setItems([]), []);
      const show = (message: React.ReactNode, options?: any) => {
        const id = Math.random().toString(36).slice(2);
        const item = { id, message, variant: options?.variant, duration: options?.duration ?? 4000, width: options?.width, height: options?.height };
        setItems(prev => [...prev, item]);
        if (item.duration && item.duration > 0) setTimeout(() => setItems(prev => prev.filter(i => i.id !== id)), item.duration);
        return id;
      };
  const hide = (id?: string) => setItems(prev => prev.filter(i => i.id !== id));
      return (
        <ToastThemeProvider>
          <div>
            <DemoBasic onShow={show} />
            <ToastContainer items={items} onClose={hide} />
          </div>
        </ToastThemeProvider>
      );
    };
    return <Wrapper />;
  },
};

function DemoOptions({ onShow }: { onShow: (msg: string, opts?: any) => void }) {
  return (
    <div style={{ padding: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Button onClick={() => onShow("Wide toast (5s)", { duration: 5000, width: 420 })}>Wide + 5s</Button>
      <Button onClick={() => onShow("Tall toast", { height: 80 })}>Tall</Button>
    </div>
  );
}

export const Customization: Story = {
  render: () => {
    const Wrapper = () => {
      const [items, setItems] = React.useState<any[]>([]);
      const show = (message: React.ReactNode, options?: any) => {
        const id = Math.random().toString(36).slice(2);
        const item = { id, message, variant: options?.variant, duration: options?.duration ?? 4000, width: options?.width, height: options?.height };
        setItems(prev => [...prev, item]);
        if (item.duration && item.duration > 0) setTimeout(() => setItems(prev => prev.filter(i => i.id !== id)), item.duration);
        return id;
      };
  const hide = (id?: string) => setItems(prev => prev.filter(i => i.id !== id));
      return (
        <ToastThemeProvider>
          <div>
            <DemoOptions onShow={show} />
            <ToastContainer items={items} placement="bottom-center" onClose={hide} />
          </div>
        </ToastThemeProvider>
      );
    };
    return <Wrapper />;
  },
  parameters: {
    docs: {
      description: {
        story: "Override placement per provider instance and control width/height/duration per toast.",
      },
    },
  },
};

export const Themed: Story = {
  render: () => {
    const Wrapper = () => {
      const [items, setItems] = React.useState<any[]>([]);
      const show = (message: React.ReactNode, options?: any) => {
        const id = Math.random().toString(36).slice(2);
        const item = { id, message, variant: options?.variant, duration: options?.duration ?? 4000, width: options?.width, height: options?.height };
        setItems(prev => [...prev, item]);
        if (item.duration && item.duration > 0) setTimeout(() => setItems(prev => prev.filter(i => i.id !== id)), item.duration);
        return id;
      };
  const hide = (id?: string) => setItems(prev => prev.filter(i => i.id !== id));
      return (
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
          <div>
            <DemoBasic onShow={show} />
            <ToastContainer items={items} onClose={hide} />
          </div>
        </ToastThemeProvider>
      );
    };
    return <Wrapper />;
  },
};
