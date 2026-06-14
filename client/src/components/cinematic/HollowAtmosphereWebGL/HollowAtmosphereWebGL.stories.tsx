import type { Meta, StoryObj } from '@storybook/react-vite';
import { HollowAtmosphereWebGL } from './HollowAtmosphereWebGL';
import './HollowAtmosphereWebGL.css';

const meta: Meta<typeof HollowAtmosphereWebGL> = {
  title: 'Cinematic/HollowAtmosphereWebGL',
  component: HollowAtmosphereWebGL,
  args: {
    scene: 'blackSignal',
    debugControls: false,
    reducedMotion: false,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#050708',
          padding: '2rem',
          boxSizing: 'border-box',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof HollowAtmosphereWebGL>;

export const DefaultVoidCube: Story = {
  args: {
    scene: 'void',
  },
  render: (args) => (
    <div
      style={{
        width: '960px',
        height: '540px',
        maxWidth: '100%',
        border: '1px solid rgb(142 248 242 / 0.14)',
        background: '#000',
      }}
    >
      <HollowAtmosphereWebGL {...args} />
    </div>
  ),
};

export const DebugWithControls: Story = {
  args: {
    scene: 'void',
    debugControls: true,
  },
  render: (args) => (
    <div
      style={{
        width: '960px',
        height: '540px',
        maxWidth: '100%',
        border: '1px solid rgb(216 184 106 / 0.18)',
        background: '#000',
      }}
    >
      <HollowAtmosphereWebGL {...args} />
    </div>
  ),
};

export const ReducedMotion: Story = {
  args: {
    scene: 'void',
    reducedMotion: true,
  },
  render: (args) => (
    <div
      style={{
        width: '960px',
        height: '540px',
        maxWidth: '100%',
        border: '1px solid rgb(142 248 242 / 0.14)',
        background: '#000',
      }}
    >
      <HollowAtmosphereWebGL {...args} />
    </div>
  ),
};

export const ResponsiveFrame: Story = {
  args: {
    scene: 'void',
  },
  render: (args) => (
    <div
      style={{
        width: 'min(100%, 960px)',
        aspectRatio: '16 / 9',
        minHeight: '360px',
        border: '1px solid rgb(142 248 242 / 0.14)',
        background: '#000',
      }}
    >
      <HollowAtmosphereWebGL {...args} />
    </div>
  ),
};

export const TallFrame: Story = {
  args: {
    scene: 'void',
  },
  render: (args) => (
    <div
      style={{
        width: '390px',
        height: '720px',
        maxWidth: '100%',
        border: '1px solid rgb(142 248 242 / 0.14)',
        background: '#000',
      }}
    >
      <HollowAtmosphereWebGL {...args} />
    </div>
  ),
};

export const ScreenShellFrame: Story = {
  args: {
    scene: 'void',
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => (
    <div className="he-hollow-atmosphere-webgl-story__screen-shell">
      <HollowAtmosphereWebGL {...args} />
    </div>
  ),
};

export const WithTerminalOverlay: Story = {
  args: {
    scene: 'void',
  },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: '960px',
        height: '540px',
        maxWidth: '100%',
        border: '1px solid rgb(142 248 242 / 0.14)',
        background: '#000',
        overflow: 'hidden',
      }}
    >
      <HollowAtmosphereWebGL {...args} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            padding: '1rem 1.25rem',
            color: 'rgb(142 248 242)',
            fontFamily:
              'var(--he-font-code, ui-monospace, SFMono-Regular, Menlo, monospace)',
            fontSize: '1rem',
            letterSpacing: '0.08em',
            background: 'rgb(0 0 0 / 0.32)',
            border: '1px solid rgb(142 248 242 / 0.18)',
            backdropFilter: 'blur(14px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(14px) saturate(1.2)',
          }}
        >
          {'> warning: names attract attention'}
        </div>
      </div>
    </div>
  ),
};

export const BlackSignal: Story = {
  args: {
    scene: 'blackSignal',
  },
  render: (args) => (
    <div
      style={{
        width: '960px',
        height: '540px',
        maxWidth: '100%',
        border: '1px solid rgb(142 248 242 / 0.14)',
        background: '#000',
      }}
    >
      <HollowAtmosphereWebGL {...args} />
    </div>
  ),
};

export const BlackSignalReducedMotion: Story = {
  args: {
    scene: 'blackSignal',
    reducedMotion: true,
  },
  render: (args) => (
    <div
      style={{
        width: '960px',
        height: '540px',
        maxWidth: '100%',
        border: '1px solid rgb(142 248 242 / 0.14)',
        background: '#000',
      }}
    >
      <HollowAtmosphereWebGL {...args} />
    </div>
  ),
};

export const BlackSignalTallFrame: Story = {
  args: {
    scene: 'blackSignal',
  },
  render: (args) => (
    <div
      style={{
        width: '390px',
        height: '720px',
        maxWidth: '100%',
        border: '1px solid rgb(142 248 242 / 0.14)',
        background: '#000',
      }}
    >
      <HollowAtmosphereWebGL {...args} />
    </div>
  ),
};

export const BlackSignalWithTerminalOverlay: Story = {
  args: {
    scene: 'blackSignal',
  },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: '960px',
        height: '540px',
        maxWidth: '100%',
        border: '1px solid rgb(142 248 242 / 0.14)',
        background: '#000',
        overflow: 'hidden',
      }}
    >
      <HollowAtmosphereWebGL {...args} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            padding: '1rem 1.25rem',
            color: 'rgb(142 248 242)',
            fontFamily:
              'var(--he-font-code, ui-monospace, SFMono-Regular, Menlo, monospace)',
            fontSize: '1rem',
            letterSpacing: '0.08em',
            background: 'rgb(0 0 0 / 0.34)',
            border: '1px solid rgb(142 248 242 / 0.18)',
            boxShadow:
              '0 0 24px rgb(142 248 242 / 0.08), inset 0 1px 0 rgb(255 255 255 / 0.05)',
            backdropFilter: 'blur(14px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(14px) saturate(1.2)',
          }}
        >
          {'> signal found'}
        </div>
      </div>
    </div>
  ),
};

export const BlackSignalStructureCheck: Story = {
  args: {
    scene: 'blackSignal',
    debugControls: true,
  },
  render: (args) => (
    <div
      style={{
        width: '1280px',
        height: '720px',
        maxWidth: '100%',
        border: '1px solid rgb(142 248 242 / 0.14)',
        background: '#000',
      }}
    >
      <HollowAtmosphereWebGL {...args} />
    </div>
  ),
};
