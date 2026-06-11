import type { Meta, StoryObj } from '@storybook/react-vite';
import { Meter } from './Meter';

const meta: Meta<typeof Meter> = {
  title: 'Primitives/Meter',
  component: Meter,
  args: {
    label: 'Signal',
    value: 72,
    max: 100,
    tone: 'stable',
    size: 'md',
    showValue: true,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['stable', 'protected', 'warning', 'danger', 'corrupted', 'memory'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Meter>;

export const Playground: Story = {};

export const Tones = () => (
  <div
    style={{
      maxWidth: 560,
      display: 'grid',
      gap: 'var(--he-space-5)',
      padding: 'var(--he-space-6)',
      background: 'var(--he-bg-base)',
    }}
  >
    <Meter label="Signal" value={78} tone="stable" />
    <Meter label="Name Stability" value={92} tone="protected" />
    <Meter label="Pressure" value={64} tone="warning" />
    <Meter label="Vow Damage" value={38} tone="danger" />
    <Meter label="Memory Drift" value={51} tone="corrupted" />
    <Meter label="Recall" value={83} tone="memory" />
  </div>
);

export const Sizes = () => (
  <div
    style={{
      maxWidth: 560,
      display: 'grid',
      gap: 'var(--he-space-5)',
      padding: 'var(--he-space-6)',
      background: 'var(--he-bg-base)',
    }}
  >
    <Meter label="Small" value={70} size="sm" />
    <Meter label="Medium" value={70} size="md" />
    <Meter label="Large" value={70} size="lg" />
  </div>
);

export const GameStats = () => (
  <div
    className="he-surface"
    data-surface="elevated"
    data-padding="lg"
    style={{
      maxWidth: 420,
      display: 'grid',
      gap: 'var(--he-space-5)',
      backgroundColor: 'var(--he-bg-base)',
    }}
  >
    <Meter label="Depth" value={100} max={300} tone="memory" valueLabel="100 fathoms" />
    <Meter label="Signal" value={76} tone="stable" valueLabel="stable" />
    <Meter label="Name Stability" value={92} tone="protected" valueLabel="protected" />
    <Meter label="Memory Drift" value={22} tone="corrupted" valueLabel="mild" />
  </div>
);
