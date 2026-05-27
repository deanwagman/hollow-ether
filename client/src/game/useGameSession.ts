import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SessionPayload } from '@ethernetic/shared';
import { interact, loadOrCreateSession } from '../lib/sessionApi';

export const GAME_SESSION_KEY = ['gameSession'] as const;

export function useGameSession() {
  const query = useQuery({
    queryKey: GAME_SESSION_KEY,
    queryFn: loadOrCreateSession,
    staleTime: Infinity,
    retry: 1,
  });

  return {
    session: query.data,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useInteract(session: SessionPayload | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => {
      if (!session?.sessionId) {
        throw new Error('No active session');
      }
      return interact(session.sessionId, text);
    },
    onSuccess: (state) => {
      queryClient.setQueryData<SessionPayload>(GAME_SESSION_KEY, (old) =>
        old ? { ...old, state } : old,
      );
    },
  });
}
