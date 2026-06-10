import type { Meta } from '@storybook/react-vite';
import './Typography.css';

const meta: Meta = {
  title: 'Foundations/Typography',
};

export default meta;

const typeScaleTokens = [
  ['2xs', '--he-text-2xs', '11px'],
  ['xs', '--he-text-xs', '12px'],
  ['sm', '--he-text-sm', '14px'],
  ['md', '--he-text-md', '16px'],
  ['lg', '--he-text-lg', '18px'],
  ['xl', '--he-text-xl', '22px'],
  ['2xl', '--he-text-2xl', '28px'],
  ['3xl', '--he-text-3xl', '36px'],
  ['4xl', '--he-text-4xl', '48px'],
];

const typographyRoles = [
  {
    name: 'Logo',
    className: 'he-logo',
    token: '--he-type-logo-',
    sample: 'HOLLOW ETHER',
    note: 'Primary game mark and large title moments.',
  },
  {
    name: 'Title',
    className: 'he-title',
    token: '--he-type-title-',
    sample: 'Act I: The Wake Layer',
    note: 'Major screen titles, act names, chapter headings.',
  },
  {
    name: 'Heading',
    className: 'he-heading',
    token: '--he-type-heading-',
    sample: 'Scene 5: Omen-Weather Satellite',
    note: 'Panel headings and scene titles.',
  },
  {
    name: 'Subheading',
    className: 'he-subheading',
    token: '--he-type-subheading-',
    sample: 'Spirit Read',
    note: 'Uppercase panel labels and section names.',
  },
  {
    name: 'Body',
    className: 'he-body',
    token: '--he-type-body-',
    sample:
      'You approach a cluster of coral antennae. A small satellite hangs upside down, tangled in ghost-kelp.',
    note: 'Default narrative prose.',
  },
  {
    name: 'Dialogue',
    className: 'he-dialogue',
    token: '--he-type-dialogue-',
    sample:
      'OMN-WTHR-3: "Good morning. Today\'s forecast is ash over the eastern districts."',
    note: 'Spirit speech and supernatural responses.',
  },
  {
    name: 'UI',
    className: 'he-ui',
    token: '--he-type-ui-',
    sample: 'Name Stability: Protected',
    note: 'HUD values, compact interface text, tabs.',
  },
  {
    name: 'Label',
    className: 'he-label',
    token: '--he-type-label-',
    sample: 'Current Vow',
    note: 'Small uppercase labels.',
  },
  {
    name: 'Caption',
    className: 'he-caption',
    token: '--he-type-caption-',
    sample: 'Acknowledge its purpose.',
    note: 'Supporting descriptions and secondary text.',
  },
  {
    name: 'Micro',
    className: 'he-micro',
    token: '--he-type-micro-',
    sample: 'DEPTH: 12m · SIGNAL: WEAK',
    note: 'Smallest HUD readouts, status ticks, and corner metadata.',
  },
  {
    name: 'Command',
    className: 'he-command',
    token: '--he-type-command-*',
    sample: '/invoke lumen.mother --depth=shallow',
    note: 'Ritual commands, terminal syntax, special invocations.',
  },
];

export const Typography = () => (
  <main className="typography-story">
    <header className="typography-story__header">
      <p className="he-label">Foundations</p>
      <h1 className="he-title">Typography</h1>
      <p className="he-body">
        The typography system for Hollow Ether. Text should feel like a ritual
        terminal: readable, atmospheric, precise, and haunted.
      </p>
    </header>

    <section className="typography-section">
      <div className="typography-section__heading">
        <h2 className="he-heading">Type Roles</h2>
        <p className="he-caption">
          Use role tokens for components instead of hardcoding font-size,
          line-height, or letter-spacing.
        </p>
      </div>

      <div className="type-role-list">
        {typographyRoles.map((role) => (
          <article className="type-role-card" key={role.name}>
            <div className="type-role-card__meta">
              <span className="he-label">{role.name}</span>
              <code>{role.token}</code>
            </div>

            <p className={role.className}>{role.sample}</p>

            <p className="he-caption">{role.note}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="typography-section">
      <div className="typography-section__heading">
        <h2 className="he-heading">Type Scale</h2>
        <p className="he-caption">
          Base scale used by typography role tokens and component styles.
        </p>
      </div>

      <div className="type-scale-table">
        {typeScaleTokens.map(([name, token, px]) => (
          <article className="type-scale-row" key={token}>
            <div>
              <span className="he-label">{name}</span>
              <code>{token}</code>
            </div>

            <p style={{ fontSize: `var(${token})` }}>
              The Hollow listens beneath the signal.
            </p>

            <span className="he-caption">{px}</span>
          </article>
        ))}
      </div>
    </section>

    <section className="typography-section">
      <div className="typography-section__heading">
        <h2 className="he-heading">Narrative Example</h2>
        <p className="he-caption">
          Example of title, prose, spirit dialogue, UI labels, and choice text.
        </p>
      </div>

      <article className="narrative-example">
        <p className="he-label">Scene 5</p>
        <h3 className="he-heading">Omen-Weather Satellite</h3>

        <p className="he-body">
          You approach a cluster of coral antennae. A small satellite hangs
          upside down, tangled in ghost-kelp. Its solar panels are cracked.
          Barnacles grow over faded letters:
          <span className="narrative-example__signal"> OMN-WTHR-3.</span>
        </p>

        <p className="he-dialogue">
          &ldquo;Good morning,&rdquo; it says. &ldquo;Today&apos;s forecast is ash over the eastern
          districts, prayer accumulation near the river, memory fog by evening.&rdquo;
        </p>

        <div className="choice-preview">
          <span className="he-label">Reflect</span>
          <p className="he-ui">&ldquo;You&apos;re still doing your job.&rdquo;</p>
          <p className="he-caption">Acknowledge its purpose.</p>
        </div>

        <p className="he-command">/bind vow.listen_before_judgment</p>
      </article>
    </section>
  </main>
);
