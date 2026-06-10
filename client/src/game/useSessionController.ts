import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SCENES } from '@hollow-ether/shared';
import { pingDevServices } from '../lib/api';
import { clearStoredSessionId } from '../lib/gameSessionStorage';
import { GAME_SESSION_KEY, useGameSession, useInteract } from './useGameSession';

export function useSessionController() {
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

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    void pingDevServices();
  }, []);

  function submitMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || inputDisabled || isBusy || !session) return;
    interactMutation.mutate(trimmed);
  }

  async function startNewGame() {
    clearStoredSessionId();
    await queryClient.resetQueries({ queryKey: GAME_SESSION_KEY });
    await refetch();
  }

  return {
    session,
    state,
    isPending,
    isError,
    isBusy,
    inputDisabled,
    sceneLabel,
    sceneKey,
    submitMessage,
    startNewGame,
    interactMutation,
  };
}
