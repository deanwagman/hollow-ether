import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChoiceCard } from '../../game/ChoiceCard/ChoiceCard';
import { Badge } from '../../primitives/Badge/Badge';
import { Button } from '../../primitives/Button/Button';
import { Meter } from '../../primitives/Meter/Meter';
import { Panel } from '../../primitives/Panel/Panel';
import { TextInput } from '../../primitives/TextInput/TextInput';
import { GameShell } from './GameShell';
import './GameShell.stories.css';

const meta: Meta<typeof GameShell> = {
  title: 'Layout/GameShell',
  component: GameShell,
  args: {
    activeSection: 'map',
  },
  argTypes: {
    activeSection: {
      control: 'select',
      options: ['recall', 'spirits', 'vows', 'options', 'map'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof GameShell>;

function MockLeftSidebar() {
  return (
    <Panel variant="default" padding="md">
      <div className="mock-sidebar">
        <div className="mock-logo">
          <span>HOLLOW</span>
          <span>ETHER</span>
        </div>

        <hr className="he-divider" />

        <div className="mock-stack">
          <Meter label="Depth" value={100} max={300} tone="memory" valueLabel="100 fathoms" />
          <Meter label="Signal" value={76} tone="stable" valueLabel="stable" />
          <Meter label="Name Stability" value={92} tone="protected" valueLabel="protected" />
        </div>

        <Panel variant="sacred" padding="sm" eyebrow="Current Vow">
          <p className="he-body">
            I will listen before I judge, but I will not confuse kindness with trust.
          </p>
          <Meter label="Integrity" value={92} tone="protected" size="sm" />
        </Panel>

        <div className="mock-section">
          <p className="he-label">Inventory</p>
          <div className="mock-list">
            <Badge tone="memory">A Clean Sorrow</Badge>
            <Badge tone="stable">Unauthorized Brightness</Badge>
            <Badge tone="sacred">A Question Put to Rest</Badge>
            <Badge tone="corrupted">Wordless Fear</Badge>
          </div>
        </div>

        <div className="mock-section">
          <p className="he-label">Known Spirits</p>
          <div className="mock-spirit-list">
            <span>Luma-of-the-First-Glow</span>
            <span>Omen-Weather Satellite</span>
            <span>The Choir of Unsent Messages</span>
            <span>Noll, the Laughing Angler</span>
          </div>
        </div>

        <Button variant="sacred" fullWidth>
          Journal
        </Button>
      </div>
    </Panel>
  );
}

function MockEncounterMain() {
  return (
    <Panel variant="elevated" padding="lg" eyebrow="Scene 5" title="Omen-Weather Satellite">
      <div className="mock-main-content">
        <p className="he-body">
          You approach a cluster of coral antennae. A small satellite hangs upside down,
          tangled in ghost-kelp. Its solar panels are cracked. Barnacles grow over faded
          letters: <span className="he-dialogue">OMN-WTHR-3.</span>
        </p>

        <p className="he-dialogue">
          &ldquo;Good morning,&rdquo; it says. &ldquo;Today&apos;s forecast is ash over the eastern districts,
          prayer accumulation near the river, memory fog by evening.&rdquo;
        </p>

        <p className="he-body">It waits.</p>

        <p className="he-dialogue">&ldquo;Are you a listener?&rdquo;</p>

        <hr className="he-divider" data-tone="active" />

        <div className="mock-choice-stack">
          <p className="he-label">What do you do?</p>

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

        <TextInput
          placeholder="Or type your own response..."
          helperText="The spirit will interpret your phrasing, tone, and intent."
          tone="active"
          fullWidth
        />
      </div>
    </Panel>
  );
}

function MockRightInspector() {
  return (
    <div className="mock-inspector">
      <Panel variant="elevated" padding="none">
        <div className="mock-art-card">
          <div className="mock-art-card__image" />
          <div className="mock-art-card__body">
            <p className="he-label">Spirit Read</p>
            <h2 className="he-heading">Omen-Weather Satellite</h2>
            <p className="he-caption">Dead orbital weather spirit</p>
          </div>
        </div>
      </Panel>

      <Panel variant="default" padding="md">
        <div className="mock-stack">
          <div className="mock-info-row">
            <span className="he-label">Type</span>
            <span className="he-ui">Dead machine-spirit</span>
          </div>
          <div className="mock-info-row">
            <span className="he-label">Signal</span>
            <span className="he-ui">Stable, looping</span>
          </div>
          <div className="mock-info-row">
            <span className="he-label">Resonance</span>
            <span className="he-ui">Dutiful / Lonely / Afraid</span>
          </div>
          <div className="mock-info-row">
            <span className="he-label">Best Approach</span>
            <span className="he-ui">Reflect before asking</span>
          </div>
        </div>
      </Panel>

      <Panel variant="active" padding="md" eyebrow="Relationship">
        <Meter label="Trust" value={34} tone="stable" valueLabel="newly opened" />
      </Panel>
    </div>
  );
}

export const EncounterShell: Story = {
  render: (args) => (
    <GameShell
      {...args}
      leftSidebar={<MockLeftSidebar />}
      rightInspector={<MockRightInspector />}
    >
      <MockEncounterMain />
    </GameShell>
  ),
};

export const MapShell: Story = {
  render: (args) => (
    <GameShell
      {...args}
      activeSection="map"
      leftSidebar={<MockLeftSidebar />}
      rightInspector={
        <Panel variant="elevated" padding="lg" eyebrow="Region" title="Signal Reef">
          <p className="he-body">
            A reef built from failed communication. Whispers, broadcasts, voicemails,
            and prayers calcify into coral.
          </p>
          <hr className="he-divider" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--he-space-2)' }}>
            <Badge tone="memory">Discovered</Badge>
            <Badge tone="stable">Signal High</Badge>
            <Badge tone="corrupted">Memory Drift Mild</Badge>
          </div>
        </Panel>
      }
    >
      <Panel variant="elevated" padding="lg" eyebrow="Act I" title="The Wake Layer">
        <div className="mock-map">
          <div className="mock-map__node mock-map__node--active">Signal Reef</div>
          <div className="mock-map__node">Listening Buoy</div>
          <div className="mock-map__node">Neon Kelp Fields</div>
          <div className="mock-map__node mock-map__node--sacred">Salt Gate</div>
          <div className="mock-map__node mock-map__node--locked">Hushed Vent</div>
        </div>
      </Panel>
    </GameShell>
  ),
};
