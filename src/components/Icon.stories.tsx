import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import { IconThemeProvider } from '../theme/iconProvider';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Gallery: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {([
        'home','search','user','settings','menu','close','bell','info','github','twitter','linkedin','cog','email','share','check','error','warning'
      ] as const).map((k) => (
        <div key={k} style={{ width: 120, padding: 8, border: '1px solid #eee', borderRadius: 8, textAlign: 'center' }}>
          <Icon name={k as any} />
          <div style={{ fontSize: 12, marginTop: 8 }}>{k}</div>
        </div>
      ))}
    </div>
  ),
};

export const Themed: Story = {
  render: () => (
    <IconThemeProvider theme={{ size: '28px', color: '#2563eb' }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <Icon name="home" />
        <Icon name="search" />
        <Icon name="github" />
      </div>
    </IconThemeProvider>
  ),
};
