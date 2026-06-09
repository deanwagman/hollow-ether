import { ReactNode } from 'react';
import type { NexusVisualState } from '../game/useNexusVisualState';
import EtherNexusScene from '../scenes/EtherNexusScene';

type AppShellProps = {
  visualState: NexusVisualState;
  sceneTitle: string;
  sceneKey: string;
  children: ReactNode;
};

export default function AppShell({
  visualState,
  sceneTitle,
  sceneKey,
  children,
}: AppShellProps) {
  return (
    <div className="app">
      <main className="viewport">
        <EtherNexusScene visualState={visualState} />
        <div className="session-shell">
          <header key={sceneKey} className="session-header text-label">
            {sceneTitle}
          </header>
          <div className="narrative-stage" aria-label="Scene presence" />
          <section className="session-main" aria-label="Dialogue">
            {children}
          </section>
        </div>
      </main>
    </div>
  );
}
