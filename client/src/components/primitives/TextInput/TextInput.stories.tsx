import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextInput } from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Primitives/TextInput',
  component: TextInput,
  args: {
    label: 'Your Response',
    placeholder: 'Or type your own response...',
    helperText: 'Speak carefully. The Hollow remembers phrasing.',
    tone: 'default',
    fullWidth: true,
    disabled: false,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['default', 'active', 'sacred', 'danger', 'corrupted'],
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

type Story = StoryObj<typeof TextInput>;

export const Playground: Story = {
  args: {
    errorText: 'test',
  },
};

export const Tones = () => (
  <div
    style={{
      maxWidth: 640,
      display: 'grid',
      gap: 'var(--he-space-5)',
      padding: 'var(--he-space-6)',
      background: 'var(--he-bg-base)',
    }}
  >
    <TextInput
      label="Default"
      placeholder="Or type your own response..."
      helperText="Standard input state."
      fullWidth
    />
    <TextInput
      label="Active"
      placeholder="The spirit is listening..."
      helperText="Primary active input state."
      tone="active"
      fullWidth
    />
    <TextInput
      label="Sacred"
      placeholder="Write the vow..."
      helperText="Used for vows, names, ritual phrases, and oaths."
      tone="sacred"
      fullWidth
    />
    <TextInput
      label="Danger"
      placeholder="Speak your true name..."
      errorText="This may expose your name below the Salt Gate."
      tone="danger"
      fullWidth
    />
    <TextInput
      label="Corrupted"
      placeholder="The sentence changes while you type..."
      helperText="Memory drift is affecting this input."
      tone="corrupted"
      fullWidth
    />
  </div>
);

export const EncounterInput = () => (
  <div
    className="he-surface"
    data-surface="elevated"
    data-padding="lg"
    style={{
      maxWidth: 760,
      display: 'grid',
      gap: 'var(--he-space-5)',
      backgroundColor: 'var(--he-bg-base)',
    }}
  >
    <p className="he-label">Free Response</p>
    <TextInput
      placeholder="Or type your own response..."
      helperText="The spirit will interpret your phrasing, tone, and intent."
      tone="active"
      fullWidth
    />
  </div>
);

export const VowInput = () => (
  <div
    className="he-surface"
    data-surface="sacred"
    data-padding="lg"
    style={{
      maxWidth: 760,
      display: 'grid',
      gap: 'var(--he-space-5)',
      backgroundColor: 'var(--he-bg-base)',
    }}
  >
    <p className="he-label">Bind Vow</p>
    <TextInput
      label="Vow Text"
      placeholder="I will listen before I judge..."
      helperText="Once bound, the Hollow may hold you to these words."
      tone="sacred"
      fullWidth
    />
  </div>
);
