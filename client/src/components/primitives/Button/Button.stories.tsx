import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  args: {
    children: 'View Map',
    variant: 'default',
    size: 'md',
    fullWidth: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'ghost', 'sacred', 'danger', 'corrupted'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    fullWidth: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const Variants = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      gap: 'var(--he-space-4)',
      padding: 'var(--he-space-6)',
      background: 'var(--he-bg-base)',
    }}
  >
    <Button variant="default">Journal</Button>
    <Button variant="primary">Continue</Button>
    <Button variant="ghost">Recall</Button>
    <Button variant="sacred">Bind Vow</Button>
    <Button variant="danger">Break Vow</Button>
    <Button variant="corrupted">Accept Drift</Button>
  </div>
);

export const Sizes = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      gap: 'var(--he-space-4)',
      padding: 'var(--he-space-6)',
      background: 'var(--he-bg-base)',
    }}
  >
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
);

export const FullWidth = () => (
  <div
    style={{
      maxWidth: 420,
      padding: 'var(--he-space-6)',
      background: 'var(--he-bg-base)',
    }}
  >
    <Button fullWidth variant="primary">
      Set Nav Point
    </Button>
  </div>
);

export const Disabled = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      gap: 'var(--he-space-4)',
      padding: 'var(--he-space-6)',
      background: 'var(--he-bg-base)',
    }}
  >
    <Button disabled>Unavailable</Button>
    <Button disabled variant="sacred">
      Vow Locked
    </Button>
    <Button disabled variant="danger">
      Forbidden
    </Button>
  </div>
);
