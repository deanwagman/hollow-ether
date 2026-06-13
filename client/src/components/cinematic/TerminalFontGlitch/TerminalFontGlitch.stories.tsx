import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TerminalFontGlitch } from './TerminalFontGlitch';
import type { TerminalFontGlitchProps } from './TerminalFontGlitch';
import './TerminalFontGlitch.css';
import '../../screens/IntroTutorialScreen/IntroTutorialScreen.css';

function IntroGlitchShell({ children }: { children: ReactNode }) {
  return (
    <main
      className="he-intro-tutorial-screen"
      data-mode="terminal"
    >
      <div className="he-intro-tutorial-screen__noise" aria-hidden="true" />
      <div className="he-intro-tutorial-screen__scanline" aria-hidden="true" />
      <section
        className="he-intro-tutorial-screen__content"
        aria-label="Intro glitch preview"
      >
        <div className="he-intro-tutorial-screen__terminal-stage">
          <div className="he-intro-tutorial-screen__terminal-slot">
            <div className="he-intro-tutorial-screen__terminal-layer">
              {children}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function renderInIntroContext(args: TerminalFontGlitchProps) {
  return (
    <IntroGlitchShell>
      <TerminalFontGlitch {...args} />
    </IntroGlitchShell>
  );
}

const meta: Meta<typeof TerminalFontGlitch> = {
  title: 'Cinematic/TerminalFontGlitch',
  component: TerminalFontGlitch,
  args: {
    text: 'warning: names attract attention',
    corruptedText: 'w_rning: n_mes attr_ct attent_on',
    intensity: 'medium',
    durationMs: 1600,
    fadeOutMs: 500,
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
    fadeOutMs: {
      control: {
        type: 'number',
        min: 0,
        max: 2000,
        step: 50,
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

export const InIntroContext: Story = {
  decorators: [],
  render: renderInIntroContext,
};

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

export const NamesAttractAttention: Story = {
  args: {
    text: 'warning: names attract attention',
    corruptedText: 'w_rning: n_mes attr_ct attent_on',
  },
  render: renderInIntroContext,
};

export const AbsenceIsShape: Story = {
  args: {
    text: 'warning: absence is also a shape',
    corruptedText: 'w_rning: abs_nce is als_ a sh_pe',
  },
  render: renderInIntroContext,
};

export const FragmentsMayAnswer: Story = {
  args: {
    text: 'warning: fragments may answer for you',
    corruptedText: 'w_rning: fr_gments may ans_er f_r y_u',
  },
  render: renderInIntroContext,
};

export const SpeakerNotSafe: Story = {
  args: {
    text: 'speaker: not yet safe to name',
    corruptedText: 'sp_aker: n_t y_t safe t_ name',
  },
  render: renderInIntroContext,
};

export const SilenceNotEmpty: Story = {
  args: {
    text: 'warning: silence is not empty here',
    corruptedText: 'w_rning: sil_nce is n_t empty h_re',
  },
  render: renderInIntroContext,
};
