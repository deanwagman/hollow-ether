import type { Meta } from '@storybook/react-vite';
import './ColorTokens.css';

const meta: Meta = {
  title: 'Foundations/Colors',
};

export default meta;

const tokenGroups = {
  'Raw Palette': [
    '--he-color-void',
    '--he-color-abyss',
    '--he-color-deep-sea',
    '--he-color-glass',
    '--he-color-glass-bright',
    '--he-color-ether-cyan',
    '--he-color-ghost-teal',
    '--he-color-pale-glow',
    '--he-color-salt-white',
    '--he-color-muted-text',
    '--he-color-dim-text',
    '--he-color-vow-gold',
    '--he-color-warning-amber',
    '--he-color-blood-coral',
    '--he-color-spirit-violet',
    '--he-color-memory-blue',
  ],
  'Semantic: Background': [
    '--he-bg-base',
    '--he-bg-elevated',
    '--he-bg-panel',
    '--he-bg-glass',
    '--he-bg-glass-strong',
  ],
  'Semantic: Text': [
    '--he-text-primary',
    '--he-text-secondary',
    '--he-text-muted',
    '--he-text-spirit',
    '--he-text-sacred',
    '--he-text-danger',
  ],
  'State Colors': [
    '--he-state-stable',
    '--he-state-protected',
    '--he-state-warning',
    '--he-state-danger',
    '--he-state-corrupted',
    '--he-state-memory',
  ],
  Borders: [
    '--he-border-subtle',
    '--he-border-medium',
    '--he-border-active',
    '--he-border-sacred',
    '--he-border-danger',
  ],
  Glows: [
    '--he-glow-cyan-sm',
    '--he-glow-cyan-md',
    '--he-glow-cyan-lg',
    '--he-glow-gold-sm',
    '--he-glow-gold-md',
    '--he-glow-danger-sm',
    '--he-glow-violet-sm',
  ],
  'Component Tokens': [
    '--he-panel-bg',
    '--he-panel-bg-strong',
    '--he-panel-border',
    '--he-panel-border-active',
    '--he-panel-shadow',
    '--he-choice-bg',
    '--he-choice-bg-hover',
    '--he-choice-bg-selected',
    '--he-choice-border',
    '--he-choice-border-selected',
    '--he-vow-bg',
    '--he-vow-border',
    '--he-vow-glow',
    '--he-map-path-current',
    '--he-map-path-possible',
    '--he-map-node-locked',
    '--he-map-node-complete',
  ],
};

function TokenCard({ token }: { token: string }) {
  const isGlow = token.includes('glow') || token.includes('shadow');
  return (
    <article className="he-token-card">
      <div
        className={`he-token-swatch${isGlow ? ' he-token-swatch--effect' : ''}`}
        style={
          isGlow
            ? { boxShadow: `var(${token})` }
            : { background: `var(${token})` }
        }
      />
      <strong>{token.replace('--he-', '')}</strong>
      <code>var({token})</code>
    </article>
  );
}

function GradientCard({ name, className }: { name: string; className: string }) {
  return (
    <article className="he-token-card">
      <div className={`he-token-swatch he-token-swatch--gradient ${className}`} />
      <strong>{name}</strong>
      <code>{className}</code>
    </article>
  );
}

export const Colors = () => (
  <main className="he-color-story">
    <header className="he-color-story__header">
      <p className="he-eyebrow">Foundations</p>
      <h1>Colors</h1>
      <p>
        The color system of Hollow Ether. Each token carries meaning across the depths:
        signal, spirit, memory, vow, corruption, danger, and sacred clarity.
      </p>
    </header>

    {Object.entries(tokenGroups).map(([groupName, tokens]) => (
      <section className="he-token-section" key={groupName}>
        <h2>{groupName}</h2>
        <div className="he-token-grid">
          {tokens.map((token) => (
            <TokenCard key={token} token={token} />
          ))}
        </div>
      </section>
    ))}

    <section className="he-token-section">
      <h2>Gradients</h2>
      <div className="he-token-grid">
        <GradientCard name="globals-body" className="he-gradient-globals" />
        <GradientCard name="color-story-canvas" className="he-gradient-story" />
      </div>
    </section>
  </main>
);
