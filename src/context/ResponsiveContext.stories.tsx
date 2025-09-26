import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ResponsiveProvider, useResponsive } from './ResponsiveContext';

const meta: Meta = {
  title: 'Context/Responsive',
  parameters: { layout: 'padded' },
};

export default meta;

const Demo: React.FC = () => {
  const r = useResponsive();
  return (
    <div style={{ padding: 12 }}>
      <div><strong>isMobile:</strong> {String(r.isMobile)}</div>
      <div><strong>isTablet:</strong> {String(r.isTablet)}</div>
      <div><strong>isDesktop:</strong> {String(r.isDesktop)}</div>
      <div><strong>width:</strong> {r.width}px</div>
      <div><strong>height:</strong> {r.height}px</div>
    </div>
  );
};

type Story = StoryObj<typeof Demo>;

export const Default: Story = {
  render: () => (
    <ResponsiveProvider initialSize={{ width: 400, height: 800 }}>
      <Demo />
    </ResponsiveProvider>
  ),
};

export const CustomBreakpoints: Story = {
  render: () => (
    <ResponsiveProvider breakpoints={{ mobile: 600, tablet: 900 }}>
      <Demo />
    </ResponsiveProvider>
  ),
};
