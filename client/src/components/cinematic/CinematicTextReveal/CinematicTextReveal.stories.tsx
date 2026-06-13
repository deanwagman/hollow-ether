import type { Meta, StoryObj } from '@storybook/react-vite';
import { CinematicTextReveal } from './CinematicTextReveal';
import './CinematicTextReveal.css';

const meta: Meta<typeof CinematicTextReveal> = {
  title: 'Cinematic/CinematicTextReveal',
  component: CinematicTextReveal,
  args: {
    tone: 'prose',
    startDelayMs: 2031,
    lineDelayMs: 4219,
    lines: [
      { text: 'You wake beneath the stars.' },
      { text: 'Not under them.', emphasis: true },
      { text: 'Beneath them.', emphasis: true },
    ],
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['prose', 'spirit', 'memory', 'sacred', 'warning'],
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          justifyItems: 'center',
          alignItems: 'start',
          paddingTop: 'clamp(7rem, 18vh, 12rem)',
          paddingInline: '2rem',
          background:
            'radial-gradient(circle at 50% 50%, rgb(6 17 22 / 70%), transparent 30rem), #000',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CinematicTextReveal>;

export const Playground: Story = {
  args: {
    lineDelayMs: 3673,
  },
};

export const AwakeningProse: Story = {
  args: {
    tone: 'prose',
    lines: [
      { text: 'You wake beneath the stars.' },
      { text: 'Not under them.', emphasis: true },
      { text: 'Beneath them.', emphasis: true },
      {
        text: 'The constellations ripple above you like fish seen through black water.',
        delayAfterMs: 3750,
      },
      { text: 'Your lungs do not ask for air.' },
      { text: 'Your hands are full of light you do not remember stealing.' },
    ],
  },
};

export const AuralithEntrance: Story = {
  args: {
    tone: 'spirit',
    lineDelayMs: 2813,
    lines: [
      { text: 'A pale figure gathers itself from the cursor.' },
      { text: 'Not a woman.', emphasis: true },
      { text: 'Not a star.', emphasis: true },
      { text: 'Not a warning.', emphasis: true },
      { text: 'Something trying to be gentle.', delayAfterMs: 3750 },
    ],
  },
};

export const SacredVow: Story = {
  args: {
    tone: 'sacred',
    lineDelayMs: 1563,
    lines: [
      { text: 'The Hollow hears promises differently.' },
      { text: 'Not as words.', emphasis: true },
      { text: 'As doors.', emphasis: true },
    ],
  },
};

export const Warning: Story = {
  args: {
    tone: 'warning',
    lineDelayMs: 1250,
    lines: [
      { text: 'Something below has repeated your answer.' },
      { text: 'It used your voice.', emphasis: true },
    ],
  },
};

export const Memory: Story = {
  args: {
    tone: 'memory',
    lineDelayMs: 1329,
    lines: [
      { text: 'A memory rises without asking permission.' },
      { text: 'Rain on glass.' },
      { text: 'A door you never opened.', emphasis: true },
    ],
  },
};
