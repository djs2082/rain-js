import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Button } from "./Button";

// Mock icons for examples
const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" />
  </svg>
);

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Button",
    variant: "text",
    color: "primary",
    size: "medium",
    disabled: false,
    fullWidth: false
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["text", "outlined", "contained"]
    },
    color: {
      control: { type: "select" },
      options: ["primary", "secondary", "success", "error", "warning", "info"]
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"]
    },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
    children: { control: "text" }
  }
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Button variant="text">Text</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="contained">Contained</Button>
    </div>
  )
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <Button variant="contained" color="primary">Primary</Button>
        <Button variant="contained" color="secondary">Secondary</Button>
        <Button variant="contained" color="success">Success</Button>
      </div>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <Button variant="contained" color="error">Error</Button>
        <Button variant="contained" color="warning">Warning</Button>
        <Button variant="contained" color="info">Info</Button>
      </div>
    </div>
  )
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Button variant="contained" size="small">Small</Button>
      <Button variant="contained" size="medium">Medium</Button>
      <Button variant="contained" size="large">Large</Button>
    </div>
  )
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <Button variant="contained" startIcon={<StarIcon />}>Start Icon</Button>
        <Button variant="contained" endIcon={<ArrowIcon />}>End Icon</Button>
      </div>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <Button variant="outlined" startIcon={<StarIcon />} endIcon={<ArrowIcon />}>
          Both Icons
        </Button>
      </div>
    </div>
  )
};

export const States: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Button variant="contained">Normal</Button>
      <Button variant="contained" disabled>Disabled</Button>
    </div>
  )
};

export const FullWidth: Story = {
  render: () => (
    <div style={{ width: "300px" }}>
      <Button variant="contained" fullWidth>
        Full Width Button
      </Button>
    </div>
  )
};

export const CustomStyling: Story = {
  render: () => (
    <Button 
      variant="contained" 
      style={{ 
        borderRadius: "20px",
        textTransform: "none",
        fontWeight: "bold",
        fontSize: "16px"
      }}
    >
      Custom Styled
    </Button>
  )
};