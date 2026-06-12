import type { Meta, StoryObj } from '@storybook/react-vite';
import { TerminalSequence } from './TerminalSequence';
import './TerminalSequence.css';

const meta: Meta<typeof TerminalSequence> = {
  title: 'Cinematic/TerminalSequence',
  component: TerminalSequence,
  args: {
    lines: [
      { text: 'signal found', holdMs: 700, deleteAfter: true },
      { text: 'source: below', holdMs: 700, deleteAfter: true },
      { text: 'breath: unnecessary', holdMs: 900, deleteAfter: true },
      { text: 'name: unstable', holdMs: 1200, deleteAfter: false },
    ],
    cursorBlinkCount: 3,
    typingSpeedMs: 64,
    deletingSpeedMs: 34,
    startDelayMs: 350,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: 'black',
          padding: '2rem',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof TerminalSequence>;

export const Default: Story = {};

export const Fast: Story = {
  args: {
    typingSpeedMs: 34,
    deletingSpeedMs: 18,
    startDelayMs: 100,
  },
};

export const NoDeleting: Story = {
  args: {
    lines: [{ text: 'signal found', holdMs: 400, deleteAfter: false }],
  },
};
