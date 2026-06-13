import type { Meta, StoryObj } from '@storybook/react-vite';
import { CinematicTextReveal } from '../CinematicTextReveal';
import { AuralithPresence } from './AuralithPresence';
import './AuralithPresence.css';

const meta: Meta<typeof AuralithPresence> = {
  title: 'Cinematic/AuralithPresence',
  component: AuralithPresence,
  args: {
    visible: true,
    intensity: 'soft',
    showMotes: true,
  },
  argTypes: {
    intensity: {
      control: 'select',
      options: ['faint', 'soft', 'awake'],
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'relative',
          minHeight: '100vh',
          overflow: 'hidden',
          display: 'grid',
          placeItems: 'center',
          background:
            'radial-gradient(circle at 50% 50%, rgb(6 17 22 / 70%), transparent 30rem), #000',
          padding: '2rem',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof AuralithPresence>;

export const Playground: Story = {};

export const Faint: Story = {
  args: {
    intensity: 'faint',
  },
};

export const Soft: Story = {
  args: {
    intensity: 'soft',
  },
};

export const Awake: Story = {
  args: {
    intensity: 'awake',
  },
};

export const WithoutMotes: Story = {
  args: {
    intensity: 'soft',
    showMotes: false,
  },
};

export const Hidden: Story = {
  args: {
    visible: false,
  },
};

export const BehindAuralithEntranceText: Story = {
  render: () => (
    <div
      style={{
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
        width: 'min(100%, 42rem)',
        minHeight: '32rem',
      }}
    >
      <AuralithPresence visible behindProse intensity="soft" />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <CinematicTextReveal
          tone="spirit"
          lineDelayMs={900}
          lines={[
            { text: 'A pale figure gathers itself from the cursor.' },
            { text: 'Not a woman.', emphasis: true },
            { text: 'Not a star.', emphasis: true },
            { text: 'Not a warning.', emphasis: true },
            { text: 'Something trying to be gentle.', delayAfterMs: 1200 },
          ]}
        />
      </div>
    </div>
  ),
};

export const BehindFirstLine: Story = {
  render: () => (
    <div
      style={{
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
        width: 'min(100%, 42rem)',
        minHeight: '32rem',
      }}
    >
      <AuralithPresence visible behindProse intensity="awake" />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <CinematicTextReveal
          tone="spirit"
          lineDelayMs={1050}
          lines={[
            { text: 'Pieces are how most true things survive the descent.' },
            { text: '"I am Auralith," she says.', emphasis: true },
            {
              text: '"The first glow is not always safe. But it is usually kind."',
              delayAfterMs: 1400,
            },
          ]}
        />
      </div>
    </div>
  ),
};
