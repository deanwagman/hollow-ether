import type { Meta, StoryObj } from '@storybook/react-vite';
import { Panel, type PanelPadding, type PanelVariant } from './Panel';
import './Panel.stories.css';

const meta: Meta<typeof Panel> = {
  title: 'Primitives/Panel',
  component: Panel,
  args: {
    variant: 'default',
    padding: 'md',
    eyebrow: 'Spirit Read',
    title: 'Omen-Weather Satellite',
    children:
      'A dead machine-spirit still looping its final forecast. It wants to know whether continuing mattered.',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'active', 'sacred', 'danger', 'corrupted'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    eyebrow: {
      control: 'text',
    },
    title: {
      control: 'text',
    },
    children: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Panel>;

export const Playground: Story = {};

const variants: PanelVariant[] = [
  'default',
  'elevated',
  'active',
  'sacred',
  'danger',
  'corrupted',
];

export const Variants = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 'var(--he-space-5)',
      padding: 'var(--he-space-6)',
      background:
        'radial-gradient(circle at 50% 0%, rgb(89 246 255 / 10%), transparent 34rem), var(--he-bg-base)',
    }}
  >
    {variants.map((variant) => (
      <Panel
        key={variant}
        variant={variant}
        padding="md"
        eyebrow={variant}
        title={`${variant[0].toUpperCase()}${variant.slice(1)} Panel`}
      >
        <p className="he-body">
          Surface treatment for {variant} Hollow Ether game UI states.
        </p>
        <hr className="he-divider" />
        <p className="he-caption">
          This panel uses the global surface tokens from Phase 1.
        </p>
      </Panel>
    ))}
  </div>
);

const paddings: PanelPadding[] = ['none', 'sm', 'md', 'lg'];

export const Padding = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: 'var(--he-space-5)',
      padding: 'var(--he-space-6)',
      background: 'var(--he-bg-base)',
    }}
  >
    {paddings.map((padding) =>
      padding === 'none' ? (
        <Panel
          key={padding}
          variant="elevated"
          padding="none"
          eyebrow="Padding"
          title={padding}
        >
          <div style={{ padding: 'var(--he-space-5)' }}>
            <p className="he-body">Child content owns its own padding.</p>
          </div>
        </Panel>
      ) : (
        <Panel
          key={padding}
          variant="elevated"
          padding={padding}
          eyebrow="Padding"
          title={padding}
        >
          <p className="he-body">
            This example shows the panel with <code>{padding}</code> padding.
          </p>
        </Panel>
      ),
    )}
  </div>
);

export const NarrativePanel = () => (
  <div
    style={{
      minHeight: '100vh',
      padding: 'var(--he-space-6)',
      background:
        'radial-gradient(circle at 72% 25%, rgb(89 246 255 / 20%), transparent 16rem), var(--he-bg-base)',
    }}
  >
    <Panel
      variant="elevated"
      padding="lg"
      eyebrow="Scene 5"
      title="Omen-Weather Satellite"
      className="story-panel-max-width"
    >
      <p className="he-body">
        You approach a cluster of coral antennae. A small satellite hangs upside
        down, tangled in ghost-kelp. Its solar panels are cracked. Barnacles grow
        over faded letters: <span className="he-dialogue">OMN-WTHR-3</span>.
      </p>

      <p className="he-dialogue">
        &ldquo;Good morning,&rdquo; it says. &ldquo;Today&apos;s forecast is ash over the eastern
        districts, prayer accumulation near the river, memory fog by evening.&rdquo;
      </p>

      <hr className="he-divider" data-tone="active" />

      <p className="he-caption">
        This example represents the main center narrative panel.
      </p>
    </Panel>
  </div>
);

export const SacredVowPanel = () => (
  <div
    style={{
      minHeight: '100vh',
      padding: 'var(--he-space-6)',
      background: 'var(--he-bg-base)',
    }}
  >
    <Panel
      variant="sacred"
      padding="lg"
      eyebrow="Current Vow"
      title="Listen Before Judgment"
      className="story-panel-max-width"
    >
      <p className="he-body">
        I will listen before I judge, but I will not confuse kindness with
        trust.
      </p>

      <hr className="he-divider" data-tone="sacred" />

      <p className="he-caption">Integrity: 92% · Pressure: rising</p>
    </Panel>
  </div>
);

export const DangerPanel = () => (
  <div
    style={{
      minHeight: '100vh',
      padding: 'var(--he-space-6)',
      background: 'var(--he-bg-base)',
    }}
  >
    <Panel
      variant="danger"
      padding="lg"
      eyebrow="Vow Strain"
      title="This choice may break your vow"
      className="story-panel-max-width"
    >
      <p className="he-body">
        You promised not to surrender your name to hunger. Noll is asking for
        the first sound that ever belonged to you.
      </p>

      <hr className="he-divider" data-tone="danger" />

      <p className="he-caption">Consequence: Name Stability may decrease.</p>
    </Panel>
  </div>
);

export const CorruptedPanel = () => (
  <div
    style={{
      minHeight: '100vh',
      padding: 'var(--he-space-6)',
      background:
        'radial-gradient(circle at 80% 20%, rgb(155 124 255 / 16%), transparent 22rem), var(--he-bg-base)',
    }}
  >
    <Panel
      variant="corrupted"
      padding="lg"
      eyebrow="Memory Drift"
      title="The Hollow edits the sentence before you finish it"
      className="story-panel-max-width"
    >
      <p className="he-body">
        The kelp repeats your unfinished thoughts back to you. Some of them are
        true. Some of them are wearing your voice.
      </p>

      <hr className="he-divider" />

      <p className="he-caption">Influence detected: Noll / Static Court</p>
    </Panel>
  </div>
);
