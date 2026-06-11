import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  args: {
    children: 'Stable',
    tone: 'stable',
    size: 'sm',
  },
  argTypes: {
    tone: {
      control: 'select',
      options: [
        'default',
        'stable',
        'protected',
        'warning',
        'danger',
        'corrupted',
        'memory',
        'sacred',
      ],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Playground: Story = {};

export const Tones = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      gap: 'var(--he-space-3)',
      padding: 'var(--he-space-6)',
      background: 'var(--he-bg-base)',
    }}
  >
    <Badge tone="default">Default</Badge>
    <Badge tone="stable">Stable</Badge>
    <Badge tone="protected">Protected</Badge>
    <Badge tone="warning">Warning</Badge>
    <Badge tone="danger">Danger</Badge>
    <Badge tone="corrupted">Corrupted</Badge>
    <Badge tone="memory">Memory</Badge>
    <Badge tone="sacred">Sacred</Badge>
  </div>
);

export const Sizes = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      gap: 'var(--he-space-3)',
      padding: 'var(--he-space-6)',
      background: 'var(--he-bg-base)',
    }}
  >
    <Badge size="sm" tone="stable">
      Small
    </Badge>
    <Badge size="md" tone="stable">
      Medium
    </Badge>
  </div>
);

export const GameExamples = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'grid',
      alignContent: 'start',
      gap: 'var(--he-space-5)',
      padding: 'var(--he-space-6)',
      background: 'var(--he-bg-base)',
    }}
  >
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--he-space-3)' }}>
      <Badge tone="memory">Discovered</Badge>
      <Badge tone="stable">Signal Stable</Badge>
      <Badge tone="protected">Name Protected</Badge>
      <Badge tone="sacred">Vow Bound</Badge>
      <Badge tone="warning">Pressure Rising</Badge>
      <Badge tone="danger">Vow Strained</Badge>
      <Badge tone="corrupted">Memory Drift</Badge>
    </div>
  </div>
);
