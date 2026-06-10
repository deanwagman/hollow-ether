import type { Meta } from '@storybook/react-vite';
import './Surfaces.css';

const meta: Meta = {
  title: 'Foundations/Surfaces',
};

export default meta;

const surfaces = [
  {
    name: 'Default',
    value: 'default',
    description:
      'Standard low-emphasis container for HUD sections and simple cards.',
    usage: 'Inventory blocks, known spirits, secondary metadata.',
  },
  {
    name: 'Elevated',
    value: 'elevated',
    description: 'Primary container that sits above the environment.',
    usage: 'Narrative panel, inspector panel, modals.',
  },
  {
    name: 'Active',
    value: 'active',
    description: 'Focused or selected surface with strong signal presence.',
    usage: 'Selected choice, active map node, focused input.',
  },
  {
    name: 'Sacred',
    value: 'sacred',
    description:
      'Ritual surface for vows, protected names, gates, and contracts.',
    usage: 'VowCard, Salt Gate offerings, oath confirmations.',
  },
  {
    name: 'Danger',
    value: 'danger',
    description:
      'High-risk surface for warnings, hostile choices, and broken vows.',
    usage: 'Vow break alerts, hostile bargains, name instability.',
  },
  {
    name: 'Corrupted',
    value: 'corrupted',
    description:
      'Unstable magical/digital surface for memory drift and static influence.',
    usage: 'Noll influence, false memories, corrupted dialogue.',
  },
];

const dividers = [
  ['Subtle', 'subtle'],
  ['Active', 'active'],
  ['Sacred', 'sacred'],
  ['Danger', 'danger'],
];

export const Surfaces = () => (
  <main className="surfaces-story">
    <header className="surfaces-story__header">
      <p className="he-label">Foundations</p>
      <h1 className="he-title">Surfaces / Panels</h1>
      <p className="he-body">
        The Hollow Ether surface system defines how glass panels, sacred cards,
        active selections, warnings, corrupted containers, dividers, shadows,
        and glows behave across the interface.
      </p>
    </header>

    <section className="surfaces-section">
      <div className="surfaces-section__heading">
        <h2 className="he-heading">Surface Variants</h2>
        <p className="he-caption">
          Each surface variant maps to a narrative meaning and should be used
          consistently across game components.
        </p>
      </div>

      <div className="surface-grid">
        {surfaces.map((surface) => (
          <article
            className="surface-demo he-surface"
            data-surface={surface.value}
            data-padding="md"
            key={surface.value}
          >
            <div className="surface-demo__topline">
              <span className="he-label">{surface.name}</span>
              <code>data-surface="{surface.value}"</code>
            </div>

            <h3 className="he-heading">{surface.name} Panel</h3>

            <p className="he-body">{surface.description}</p>

            <hr className="he-divider" />

            <p className="he-caption">
              <strong>Usage:</strong> {surface.usage}
            </p>
          </article>
        ))}
      </div>
    </section>

    <section className="surfaces-section">
      <div className="surfaces-section__heading">
        <h2 className="he-heading">Dividers</h2>
        <p className="he-caption">
          Dividers separate content without introducing heavy borders.
        </p>
      </div>

      <div className="divider-list">
        {dividers.map(([name, tone]) => (
          <article className="divider-demo" key={tone}>
            <div className="divider-demo__meta">
              <span className="he-label">{name}</span>
              <code>data-tone="{tone}"</code>
            </div>
            <hr
              className="he-divider"
              data-tone={tone === 'subtle' ? undefined : tone}
            />
          </article>
        ))}
      </div>
    </section>

    <section className="surfaces-section">
      <div className="surfaces-section__heading">
        <h2 className="he-heading">Glass Over Art</h2>
        <p className="he-caption">
          Panels should remain readable when layered over atmospheric artwork.
        </p>
      </div>

      <div className="art-demo">
        <article
          className="art-demo__panel he-surface"
          data-surface="elevated"
          data-padding="lg"
        >
          <p className="he-label">Spirit Read</p>
          <h3 className="he-heading">Omen-Weather Satellite</h3>
          <p className="he-body">
            A dead machine-spirit still looping its final forecast. The panel
            should remain legible against bright cyan fog and dark ocean forms.
          </p>
          <hr className="he-divider" data-tone="active" />
          <p className="he-caption">Signal: Stable, looping</p>
        </article>
      </div>
    </section>
  </main>
);
