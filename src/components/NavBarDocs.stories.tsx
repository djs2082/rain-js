import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { NavBar, type NavLinkItem } from "./NavBar";
import { NavBarThemeProvider } from "../theme/navBarProvider";
import { Button } from "./Button";

const meta: Meta<typeof NavBar> = {
  title: "Components/NavBar/Documentation",
  component: NavBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Responsive navigation bar with branding, configurable menu, right actions, hamburger on mobile, and theming support."
      }
    }
  }
};
export default meta;

type Story = StoryObj<typeof NavBar>;

const links: NavLinkItem[] = [
  { key: "home", label: "Home", href: "#", active: true },
  { key: "features", label: "Features", href: "#" },
  { key: "pricing", label: "Pricing", href: "#" },
  { key: "about", label: "About", href: "#" },
];

const brand = (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
    <span style={{ width: 24, height: 24, background: "#2563eb", borderRadius: 6, display: "inline-block" }} />
    <strong>Rain UI</strong>
  </div>
);

const right = (
  <div style={{ display: "inline-flex", gap: 8 }}>
    <Button variant="text" color="primary">Login</Button>
    <Button variant="contained" color="primary">Sign up</Button>
  </div>
);

export const Basic: Story = {
  render: () => (
    <NavBar brand={brand} links={links} right={right} sticky />
  )
};

export const CustomHeight: Story = {
  render: () => (
    <NavBar brand={brand} links={links} right={right} height={72} />
  )
};

export const CollapseAtSmall: Story = {
  render: () => (
    <NavBar brand={brand} links={links} right={right} collapseAt={640} />
  )
};

export const Themed: Story = {
  render: () => (
    <NavBarThemeProvider
      theme={{
        container: {
          background: "#111827",
          color: "#f9fafb",
          borderBottom: "1px solid #374151",
          height: "64px",
          paddingX: "20px",
        },
        brand: {
          color: "#f9fafb",
          fontSize: "18px",
          fontWeight: 700,
        },
        link: {
          color: "#d1d5db",
          hoverColor: "#fff",
          activeColor: "#60a5fa",
          padding: "8px 10px",
          fontSize: "14px",
          borderRadius: "6px",
        },
        hamburger: { color: "#e5e7eb", size: "22px" },
        menu: { gap: "10px", mobileBackground: "#111827" },
        breakpoint: 768,
      }}
    >
      <NavBar brand={brand} links={links} right={right} sticky />
    </NavBarThemeProvider>
  )
};
