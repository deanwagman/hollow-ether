import { FormEvent, useEffect, useState } from 'react';
import NarrativePanel from './components/NarrativePanel';
import { useGameSession, useInteract } from './game/useGameSession';
import { pingApi } from './lib/api';
import { clearStoredSessionId } from './lib/gameSessionStorage';
import EtherNexusScene from './scenes/EtherNexusScene';
import { useQueryClient } from '@tanstack/react-query';

export default function App() {
  const [input, setInput] = useState('');
  const queryClient = useQueryClient();
  const { session, isPending, isError, refetch } = useGameSession();
  const interactMutation = useInteract(session);

  const state = session?.state;
  const inputDisabled =
    state?.inputDisabled ?? true;
  const isBusy = isPending || interactMutation.isPending;

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    pingApi().then((ok) => {
      if (ok) {
        console.debug('[ethernetic] API reachable at /api/health');
      } else {
        console.debug('[ethernetic] API ping failed — is the server running? (npm run dev)');
      }
    });
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || inputDisabled || isBusy || !session) return;
    interactMutation.mutate(trimmed);
    setInput('');
  }

  const placeholder = state?.inputDisabled
    ? 'Act 1 complete — Elara awaits (coming soon).'
    : 'Speak to the EtherNet…';

  async function handleNewGame() {
    clearStoredSessionId();
    await queryClient.resetQueries({ queryKey: ['gameSession'] });
    await refetch();
  }

  return (
    <div className="app">
      <main className="viewport">
        <p className="scene-label text-label">Ether Nexus</p>
        <EtherNexusScene />
      </main>
      {isError ? (
        <section className="narrative-panel panel panel--ether narrative-panel--status">
          <p className="narrative-message narrative-message--player">
            Could not reach the server. Run <code>npm run dev</code> to start the client and API.
          </p>
        </section>
      ) : (
        <NarrativePanel
          messages={state?.messages ?? []}
          isLoading={isPending}
        />
      )}
      <footer className="input-bar panel panel--ether">
        <form className="input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="input"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Message input"
            autoComplete="off"
            disabled={inputDisabled || isBusy || isError}
          />
          <button
            type="button"
            className="btn btn--nav"
            onClick={handleNewGame}
            disabled={isBusy}
            aria-label="Start a new game session"
          >
            New game
          </button>
          <button
            type="submit"
            className="btn btn--nav"
            disabled={inputDisabled || isBusy || isError}
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}
