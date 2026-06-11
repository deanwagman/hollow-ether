import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChoiceCard } from './ChoiceCard';

const meta: Meta<typeof ChoiceCard> = {
  title: 'Game Components/ChoiceCard',
  component: ChoiceCard,
  args: {
    kind: 'reflect',
    text: "You're still doing your job.",
    description: 'Acknowledge its purpose.',
    state: 'default',
    selected: false,
    disabled: false,
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['ask', 'reflect', 'defy', 'offer', 'silence', 'vow', 'name', 'ritual'],
    },
    state: {
      control: 'select',
      options: [
        'default',
        'selected',
        'disabled',
        'locked',
        'vowAligned',
        'vowWarning',
        'danger',
        'corrupted',
      ],
    },
    selected: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ChoiceCard>;

export const Playground: Story = {};

export const ChoiceTypes = () => (
  <div
    style={{
      maxWidth: 720,
      display: 'grid',
      gap: 'var(--he-space-4)',
      padding: 'var(--he-space-6)',
      background: 'var(--he-bg-base)',
    }}
  >
    <ChoiceCard
      kind="ask"
      text="What happened to your city?"
      description="Seek the truth behind the signal."
    />
    <ChoiceCard
      kind="reflect"
      text="You're still doing your job."
      description="Acknowledge its purpose."
    />
    <ChoiceCard
      kind="defy"
      text="That forecast is useless now."
      description="Challenge its continued function."
    />
    <ChoiceCard
      kind="offer"
      text="Give it your wordless fear."
      description="Offer something of yourself."
    />
    <ChoiceCard
      kind="silence"
      text="Wait. Listen."
      description="Allow the spirit to continue."
    />
    <ChoiceCard
      kind="vow"
      text="I will witness your final forecast."
      description="Bind yourself to a promise."
    />
    <ChoiceCard
      kind="name"
      text="Give a false name."
      description="Attempt to satisfy the Gate without exposing yourself."
    />
    <ChoiceCard
      kind="ritual"
      text="/invoke listener.protocol"
      description="Use ritual command syntax."
    />
  </div>
);

export const States = () => (
  <div
    style={{
      maxWidth: 720,
      display: 'grid',
      gap: 'var(--he-space-4)',
      padding: 'var(--he-space-6)',
      background: 'var(--he-bg-base)',
    }}
  >
    <ChoiceCard
      kind="ask"
      text="What happened to your city?"
      description="Default available choice."
      state="default"
    />
    <ChoiceCard
      kind="reflect"
      text="You're still doing your job."
      description="Currently selected choice."
      state="selected"
    />
    <ChoiceCard
      kind="offer"
      text="Offer Unauthorized Brightness."
      description="This choice is supported by your current vow."
      state="vowAligned"
    />
    <ChoiceCard
      kind="defy"
      text="Tell the spirit what it wants to hear."
      description="This may strain your vow."
      state="vowWarning"
    />
    <ChoiceCard
      kind="name"
      text="Speak your true name."
      description="This choice carries serious consequences."
      state="danger"
    />
    <ChoiceCard
      kind="ritual"
      text="/accept drift"
      description="The Hollow edits the command while you read it."
      state="corrupted"
    />
    <ChoiceCard
      kind="vow"
      text="Bind the Salt Court pact."
      description="You do not meet the requirement."
      requirement="Requires: Court of Salt trust 3+"
      state="locked"
    />
    <ChoiceCard
      kind="silence"
      text="Remain silent."
      description="Disabled example."
      state="disabled"
    />
  </div>
);

export const EncounterChoiceStack = () => (
  <div
    style={{
      minHeight: '100vh',
      padding: 'var(--he-space-6)',
      background:
        'radial-gradient(circle at 72% 25%, rgb(89 246 255 / 18%), transparent 18rem), var(--he-bg-base)',
    }}
  >
    <div
      className="he-surface"
      data-surface="elevated"
      data-padding="lg"
      style={{ maxWidth: 820 }}
    >
      <p className="he-label">What do you do?</p>

      <div
        style={{
          display: 'grid',
          gap: 'var(--he-space-4)',
          marginTop: 'var(--he-space-5)',
        }}
      >
        <ChoiceCard
          kind="ask"
          text="What happened to your city?"
          description="Seek the truth behind the signal."
        />
        <ChoiceCard
          kind="reflect"
          text="You're still doing your job."
          description="Acknowledge its purpose."
          selected
        />
        <ChoiceCard
          kind="defy"
          text="That forecast is useless now."
          description="Challenge its continued function."
        />
        <ChoiceCard
          kind="offer"
          text="Give it your wordless fear."
          description="Offer something of yourself."
        />
        <ChoiceCard
          kind="silence"
          text="Wait. Listen."
          description="Allow the spirit to continue."
        />
      </div>
    </div>
  </div>
);

export const VowPressure = () => (
  <div
    style={{
      maxWidth: 720,
      display: 'grid',
      gap: 'var(--he-space-4)',
      padding: 'var(--he-space-6)',
      background: 'var(--he-bg-base)',
    }}
  >
    <ChoiceCard
      kind="reflect"
      text="What do you need forgiveness to mean?"
      description="Vow-aligned response unlocked by Listen Before Judgment."
      state="vowAligned"
    />
    <ChoiceCard
      kind="defy"
      text="You are lying."
      description="This may violate your vow to listen before judgment."
      state="vowWarning"
    />
  </div>
);
