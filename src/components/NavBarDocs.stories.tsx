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

export const StickyModes: Story = {
  parameters: {
    docs: {
      description: {
        story: "Demonstrates different sticky modes for mobile compatibility. The NavBar component automatically uses fixed positioning on mobile devices to ensure reliable stickiness regardless of container properties."
      }
    }
  },
  render: () => (
    <div>
      <div style={{ padding: '10px 20px', background: '#f3f4f6', marginBottom: '10px' }}>
        <p><strong>Mobile Sticky Behavior:</strong> This NavBar component has been enhanced to automatically use fixed positioning on mobile devices, making it reliably sticky regardless of container properties.</p>
      </div>
      
      {/* Regular NavBar with sticky enabled */}
      <div style={{ marginBottom: '10px' }}>
        <NavBar
          brand={<>Auto-Fixed on Mobile</>}
          links={[{ key: 'home', label: 'Uses fixed on mobile automatically', href: '#', active: true }]}
          right={<Button size="small" variant="outlined">Action</Button>}
          sticky
        />
      </div>
      
      {/* Problem demonstration with overflow container */}
      <div style={{ 
        marginTop: '40px', 
        border: '1px dashed #d1d5db',
        padding: '10px',
        background: '#f9fafb' 
      }}>
        <h3>Test with Problem Container</h3>
        <p>Below is a container with <code>overflow: hidden</code> that would normally break sticky behavior:</p>
        
        <div style={{ 
          height: '300px', 
          overflow: 'auto', 
          border: '1px solid #e5e7eb',
          position: 'relative'
        }}>
          <NavBar
            brand={<>Inside overflow container</>}
            links={[{ key: 'test', label: 'Still works on mobile', href: '#' }]}
            right={<Button size="small" variant="outlined">Test</Button>}
            sticky
          />
          
          <div style={{ height: '600px', padding: '20px', paddingTop: '60px' }}>
            <p>Scroll this inner container to test sticky behavior. On mobile, the NavBar will remain visible.</p>
            <p>This demonstrates how our enhanced NavBar handles problematic containers.</p>
            <div style={{ marginTop: '200px' }}>
              <p>The NavBar uses JavaScript to detect mobile devices and automatically enhances the sticky behavior.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Force fixed mode example */}
      <div style={{ marginTop: '40px' }}>
        <h3>Explicitly Using Fixed Mode</h3>
        <p>For specific cases, you can explicitly set <code>stickyMode="fixed"</code>:</p>
        
        <NavBar
          brand={<>Always Fixed</>}
          links={[{ key: 'fixed', label: 'Using explicit fixed mode', href: '#' }]}
          right={<Button size="small" variant="outlined">Fixed</Button>}
          sticky
          stickyMode="fixed"
        />
        
        <div style={{ height: '200px', padding: '20px', background: 'linear-gradient(to bottom, #f9fafb, #e5e7eb)', marginTop: '20px' }}>
          <p>With <code>stickyMode="fixed"</code>, the NavBar is completely removed from document flow (note the space above).</p>
          <p>This mode is automatically used on mobile for better compatibility with all containers.</p>
        </div>
      </div>
    </div>
  )
};

export const MobileMenuRight: Story = {
  parameters: {
    viewport: { defaultViewport: 'iphone6' },
    docs: { description: { story: 'Mobile menu constrained to content width and aligned to the right. This prevents the mobile drawer from covering the entire width and keeps actions visually grouped.' } }
  },
  render: () => (
    <div style={{ padding: 0 }}>
      <p style={{ padding: '8px 16px' }}><strong>Tip:</strong> Resize the Storybook preview to a mobile width to see the right-aligned mobile menu.</p>
      <NavBar brand={brand} links={links} right={right} collapseAt={768} />
    </div>
  )
};
