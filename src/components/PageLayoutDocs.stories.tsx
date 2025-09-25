import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { PageLayout } from "./PageLayout";
import { PageLayoutThemeProvider } from "../theme/pageLayoutProvider";

/**
 * # PageLayout
 * 
 * A responsive, grid-based page layout component with configurable header/footer, sticky options,
 * and no window scroll. The middle content area is scrollable.
 * 
 * - Uses CSS Grid with rows for header/content/footer
 * - Header/footer heights configurable (default 60px)
 * - Sticky header/footer via props
 * - Mobile responsive by default (uses flex + minHeight:0 to enable scroll)
 * - Prevents screen scroll; only the content area scrolls
 */
const meta: Meta<typeof PageLayout> = {
  title: "Layout/PageLayout/Documentation",
  component: PageLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A responsive, grid-based page layout with configurable header/footer and sticky options."
      }
    }
  }
};
export default meta;

type Story = StoryObj<typeof PageLayout>;

const Header = ({ title = "Header" }) => (
  <div style={{ height: "100%", display: "flex", alignItems: "center", padding: "0 16px", background: "#1976d2", color: "white", fontWeight: 600 }}>
    {title}
  </div>
);

const Footer = ({ title = "Footer" }) => (
  <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", background: "#0d47a1", color: "white" }}>
    <span>{title}</span>
    <span style={{ fontSize: 12, opacity: 0.8 }}>© 2025</span>
  </div>
);

const FakeContent = ({ lines = 50 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} style={{ padding: 12, background: i % 2 === 0 ? "#f7f7f7" : "#eceff1", borderRadius: 6 }}>
        Content row {i + 1}
      </div>
    ))}
  </div>
);

/**
 * ## Basic
 * 
 * Header and footer are part of the scrollable area (not sticky).
 */
export const Basic: Story = {
  render: () => (
    <PageLayout
      header={<Header />}
      footer={<Footer />}
      contentPadding={16}
      background="#fafafa"
    >
      <FakeContent />
    </PageLayout>
  )
};

/**
 * ## Sticky Header
 */
export const StickyHeader: Story = {
  render: () => (
    <PageLayout
      header={<Header title="Sticky Header" />}
      stickyHeader
      contentPadding={16}
      background="#fafafa"
    >
      <FakeContent />
    </PageLayout>
  )
};

/**
 * ## Sticky Footer
 */
export const StickyFooter: Story = {
  render: () => (
    <PageLayout
      footer={<Footer title="Sticky Footer" />}
      stickyFooter
      contentPadding={16}
      background="#fafafa"
    >
      <FakeContent />
    </PageLayout>
  )
};

/**
 * ## Sticky Header and Footer
 */
export const StickyBoth: Story = {
  render: () => (
    <PageLayout
      header={<Header title="Sticky Header" />}
      footer={<Footer title="Sticky Footer" />}
      stickyHeader
      stickyFooter
      contentPadding={16}
      background="#fafafa"
    >
      <FakeContent />
    </PageLayout>
  )
};

/**
 * ## Custom Heights
 * 
 * Customize header and footer heights.
 */
export const CustomHeights: Story = {
  render: () => (
    <PageLayout
      header={<Header title="Header 80px" />}
      footer={<Footer title="Footer 120px" />}
      headerHeight={80}
      footerHeight={120}
      stickyHeader
      stickyFooter
      contentPadding={16}
      background="#fafafa"
    >
      <FakeContent />
    </PageLayout>
  )
};

/**
 * ## Content Only (No header/footer)
 */
export const ContentOnly: Story = {
  render: () => (
    <PageLayout contentPadding={16} background="#fafafa">
      <FakeContent />
    </PageLayout>
  )
};

/**
 * ## Inside a container (not full viewport)
 * 
 * Set fullHeight to false to allow the layout to size to its parent. The content still scrolls internally.
 */
export const InContainer: Story = {
  render: () => (
    <div style={{ height: 500, border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
      <PageLayout
        fullHeight={false}
        header={<Header />}
        footer={<Footer />}
        contentPadding={16}
      >
        <FakeContent lines={30} />
      </PageLayout>
    </div>
  )
};

/**
 * ## Theming
 * 
 * Use PageLayoutThemeProvider to override defaults like header/footer heights, colors, borders, and content padding.
 */
export const ThemedLayout: Story = {
  render: () => (
    <PageLayoutThemeProvider
      theme={{
        surface: { background: "#0b1020" },
        header: {
          defaultHeight: "64px",
          background: "#111827",
          color: "#f9fafb",
          borderBottom: "1px solid #374151",
          zIndex: 200
        },
        footer: {
          defaultHeight: "72px",
          background: "#111827",
          color: "#e5e7eb",
          borderTop: "1px solid #374151",
          zIndex: 200
        },
        content: {
          padding: "20px",
          background: "#0f172a"
        }
      }}
    >
      <PageLayout
        header={<Header title="Themed Header" />}
        footer={<Footer title="Themed Footer" />}
        stickyHeader
        stickyFooter
      >
        <FakeContent />
      </PageLayout>
    </PageLayoutThemeProvider>
  )
};
