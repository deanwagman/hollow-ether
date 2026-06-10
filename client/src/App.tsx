import { FormEvent, useEffect, useState } from 'react';
import { SCENES } from '@hollow-ether/shared';
import AppShell from './components/AppShell';
import SuspendedNarrativeLayer from './components/SuspendedNarrativeLayer';
import { useNexusVisualState } from './game/useNexusVisualState';
import { useGameSession, useInteract } from './game/useGameSession';
import { pingDevServices } from './lib/api';
import { clearStoredSessionId } from './lib/gameSessionStorage';
import { useQueryClient } from '@tanstack/react-query';

export default function App() {
  const [input, setInput] = useState('');
  const [isRevealing, setIsRevealing] = useState(false);
  const queryClient = useQueryClient();
  const { session, isPending, isError, refetch } = useGameSession();
  const interactMutation = useInteract(session);

  const state = session?.state;
  const inputDisabled = state?.inputDisabled ?? true;
  const isBusy = isPending || interactMutation.isPending;
  const sceneLabel = state
    ? (SCENES[state.currentScene]?.label ?? 'Ether Nexus')
    : 'Awakening';
  const sceneKey = state?.currentScene ?? 'loading';

  const visualState = useNexusVisualState(
    state,
    interactMutation.isSuccess ? interactMutation.data : undefined,
  );

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    void pingDevServices();
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || inputDisabled || isBusy || isRevealing || !session) return;
    interactMutation.mutate(trimmed);
    setInput('');
  }

  const act1Complete = state?.inputDisabled ?? false;
  const placeholder = act1Complete ? 'Act 1 complete.' : 'Speak to the Hollow Ether…';
  const inputTitle = act1Complete
    ? 'Act 1 complete — Elara awaits (coming soon).'
    : undefined;

  async function handleNewGame() {
    clearStoredSessionId();
    await queryClient.resetQueries({ queryKey: ['gameSession'] });
    await refetch();
  }

  return (
    <AppShell
      visualState={visualState}
      sceneTitle={sceneLabel}
      sceneKey={sceneKey}
    >
      <SuspendedNarrativeLayer
        sessionId={session?.sessionId ?? ''}
        messages={state?.messages ?? []}
        isLoading={isPending && !(state?.messages.length ?? 0)}
        isListening={interactMutation.isPending}
        isError={isError}
        onRevealingChange={setIsRevealing}
        errorContent={
          <p className="narrative-message narrative-message--player">
            Could not reach the server. Run <code>npm run dev</code> to start the client and
            API.
          </p>
        }
      />
      <footer className="input-bar">
        <form className="input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="input"
            placeholder={placeholder}
            title={inputTitle}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label={inputTitle ?? 'Message input'}
            autoComplete="off"
            disabled={inputDisabled || isBusy || isError || isRevealing}
          />
          <button
            type="button"
            className="btn btn--nav btn--ghost"
            onClick={handleNewGame}
            disabled={isBusy || isRevealing}
            aria-label="Start a new game session"
          >
            New game
          </button>
          <button
            type="submit"
            className="btn btn--nav btn--compact"
            disabled={inputDisabled || isBusy || isError || isRevealing}
          >
            Send
          </button>
        </form>
      </footer>
    </AppShell>
  );
}
