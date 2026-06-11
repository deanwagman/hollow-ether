import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { TitleScreen } from './TitleScreen';

const meta: Meta<typeof TitleScreen> = {
  title: 'Screens/TitleScreen',
  component: TitleScreen,
  args: {
    logoSrc: 'images/logo-transparent.png',
    hasContinue: false,
    version: 'prototype 0.1.0',
    subtitle: 'A ritual conversation beneath space and sea.',
    audioStatus: 'off',
  },
  argTypes: {
    audioStatus: {
      control: 'select',
      options: ['off', 'loading', 'on'],
    },
    hasContinue: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof TitleScreen>;

export const Default: Story = {};

export const WithContinue: Story = {
  args: {
    hasContinue: true,
    audioStatus: 'on',
  },
};

export const AudioLoading: Story = {
  args: {
    audioStatus: 'loading',
  },
};

export const AudioReactiveMock: Story = {
  render: (args) => (
    <div
      style={
        {
          '--he-audio-pulse': 0.75,
          '--he-audio-bass': 0.55,
          '--he-audio-treble': 0.4,
        } as CSSProperties
      }
    >
      <TitleScreen {...args} audioStatus="on" hasContinue />
    </div>
  ),
};

export const AlternateSubtitle: Story = {
  args: {
    subtitle: 'Speak with the dead signals beneath the stars.',
  },
};
