import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import Loader from "./Loader";
import { Button } from "./Button";

const meta: Meta<typeof Loader> = {
  title: "Components/Loader/Documentation",
  component: Loader,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Versatile loader: spinner, skeleton, and image loader. Supports fullscreen or parent overlay, backdrop click-through, and multiple spinner styles.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const SpinnerBasic: Story = {
  args: {
    variant: "spinner",
    spinnerType: "ring",
    label: "Loading...",
  },
};

export const SpinnerTypes: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
      <Loader variant="spinner" spinnerType="ring" label="Ring" />
      <Loader variant="spinner" spinnerType="dots" label="Dots" />
      <Loader variant="spinner" spinnerType="hourglass" label="Hourglass" />
    </div>
  ),
};

export const SkeletonList: Story = {
  args: {
    variant: "skeleton",
    rows: 5,
    skeletonHeight: 12,
    skeletonGap: 10,
    skeletonAnimate: true,
  },
};

export const ImageLoaderDemo: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
      <Loader variant="image" src="https://picsum.photos/seed/1/300/180" imgWidth={300} imgHeight={180} />
      <Loader variant="image" src="https://picsum.photos/seed/2/300/180" imgWidth={300} imgHeight={180} spinnerType="dots" />
    </div>
  ),
};

export const FullscreenOverlay: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Show fullscreen loader</Button>
        {open && (
          <Loader fullscreen overlay overlayOpacity={0.45} label="Please wait..." onBackdropClick={() => setOpen(false)} />
        )}
      </div>
    );
  },
};

export const ParentOverlay: Story = {
  render: () => (
    <div style={{ position: "relative", height: 180, border: "1px solid #e5e7eb", borderRadius: 8 }}>
      <Loader coverParent overlay label="Loading section" />
    </div>
  ),
};

export const ClickThroughBackdrop: Story = {
  render: () => (
    <div style={{ position: "relative", height: 120, border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
      <Loader coverParent overlay backdropClickable label="Click through" />
      <Button onClick={() => alert("Clicked underlying button")}>Underlying Button</Button>
    </div>
  ),
};
