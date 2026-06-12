import type { Meta, StoryObj } from '@storybook/react-vite';
import { IntroChoiceCard } from './IntroChoiceCard';

const meta: Meta<typeof IntroChoiceCard> = {
  title: 'Cinematic/IntroChoiceCard',
  component: IntroChoiceCard,
  args: {
    label: 'Who is asking?',
    eyebrow: 'Query',
    tone: 'signal',
    selected: false,
    disabled: false,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['default', 'signal', 'memory', 'warning', 'silence'],
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background:
            'radial-gradient(circle at 50% 50%, rgb(6 17 22 / 70%), transparent 30rem), #000',
          padding: '2rem',
        }}
      >
        <div style={{ width: 'min(100%, 28rem)' }}>
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof IntroChoiceCard>;

export const Playground: Story = {};

export const Default: Story = {
  args: {
    label: 'Yes.',
    eyebrow: 'Answer',
    tone: 'default',
  },
};

export const Memory: Story = {
  args: {
    label: 'I remember pieces.',
    eyebrow: 'Memory',
    tone: 'memory',
  },
};

export const Warning: Story = {
  args: {
    label: 'No.',
    eyebrow: 'Answer',
    tone: 'warning',
  },
};

export const Silence: Story = {
  args: {
    label: 'Remain silent.',
    eyebrow: 'Silence',
    tone: 'silence',
  },
};

export const Selected: Story = {
  args: {
    label: 'Who is asking?',
    eyebrow: 'Query',
    tone: 'signal',
    selected: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Continue',
    eyebrow: 'Unavailable',
    disabled: true,
  },
};

export const WithDescription: Story = {
  args: {
    label: 'I remember pieces.',
    eyebrow: 'Memory',
    description: 'Fragments may answer for you.',
    tone: 'memory',
  },
};

export const FirstQuestionSet: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: 'var(--he-space-3)',
      }}
    >
      <IntroChoiceCard label="Yes." eyebrow="Answer" tone="default" />
      <IntroChoiceCard label="No." eyebrow="Answer" tone="warning" />
      <IntroChoiceCard
        label="I remember pieces."
        eyebrow="Memory"
        tone="memory"
      />
      <IntroChoiceCard
        label="Who is asking?"
        eyebrow="Query"
        tone="signal"
      />
      <IntroChoiceCard
        label="Remain silent."
        eyebrow="Silence"
        tone="silence"
      />
    </div>
  ),
};
