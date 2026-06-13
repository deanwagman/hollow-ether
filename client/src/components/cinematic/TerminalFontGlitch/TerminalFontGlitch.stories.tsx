import type { Meta, StoryObj } from '@storybook/react-vite';
import { TerminalFontGlitch } from './TerminalFontGlitch';
import './TerminalFontGlitch.css';

const meta: Meta<typeof TerminalFontGlitch> = {
  title: 'Cinematic/TerminalFontGlitch',
  component: TerminalFontGlitch,
  args: {
    text: 'warning: names attract attention',
    corruptedText: 'w_rning: n_mes attr_ct attent_on',
    intensity: 'medium',
    durationMs: 1600,
    autoPlay: true,
  },
  argTypes: {
    intensity: {
      control: 'select',
      options: ['subtle', 'medium', 'severe'],
    },
    durationMs: {
      control: {
        type: 'number',
        min: 300,
        max: 4000,
        step: 100,
      },
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
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof TerminalFontGlitch>;

export const Playground: Story = {};

export const Subtle: Story = {
  args: {
    intensity: 'subtle',
    text: 'speaker: not yet safe to name',
    corruptedText: 'sp_aker: n_t y_t safe t name',
    durationMs: 1200,
  },
};

export const Medium: Story = {
  args: {
    intensity: 'medium',
    text: 'warning: silence is not empty here',
    corruptedText: 'w_rning: sil_nce is n_t empty h_re',
    durationMs: 1600,
  },
};

export const Severe: Story = {
  args: {
    intensity: 'severe',
    text: 'partial name echo detected',
    corruptedText: 'p_rtial n_me ech_ det_cted',
    durationMs: 1800,
  },
};

export const GeneratedCorruption: Story = {
  args: {
    text: 'warning: absence is also a shape',
    corruptedText: undefined,
    intensity: 'medium',
  },
};

export const Static: Story = {
  args: {
    autoPlay: false,
    text: 'warning: names attract attention',
    corruptedText: 'w_rning: n_mes attr_ct attent_on',
  },
};
