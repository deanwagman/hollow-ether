import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { NarrativeLine } from './types';
import { REVEAL_LINE_MS } from '../theme/motion';

export type RevealPhase = 'complete' | 'active' | 'pending';

export type SpiritRevealState = {
  sessionId: string;
  activeId: string | null;
  pendingIds: string[];
  completedIds: Set<string>;
  seenIds: Set<string>;
};

function isSpiritMessage(message: NarrativeLine): boolean {
  return message.speaker !== 'player';
}

function spiritMessages(messages: NarrativeLine[]): NarrativeLine[] {
  return messages.filter(isSpiritMessage);
}

/** Fresh session: single spirit opening line should animate */
export function shouldAnimateOpening(
  messages: NarrativeLine[],
  reducedMotion: boolean,
): boolean {
  if (reducedMotion) return false;
  return messages.length === 1 && messages[0]!.speaker !== 'player';
}

export function createInitialState(
  sessionId: string,
  messages: NarrativeLine[],
  reducedMotion: boolean,
): SpiritRevealState {
  const spirits = spiritMessages(messages);
  const completedIds = new Set<string>();
  const seenIds = new Set(spirits.map((m) => m.id));
  let activeId: string | null = null;
  const pendingIds: string[] = [];

  if (reducedMotion) {
    spirits.forEach((m) => completedIds.add(m.id));
  } else if (shouldAnimateOpening(messages, reducedMotion)) {
    activeId = spirits[0]!.id;
  } else {
    spirits.forEach((m) => completedIds.add(m.id));
  }

  return { sessionId, activeId, pendingIds, completedIds, seenIds };
}

export function enqueueNewSpiritIds(
  state: SpiritRevealState,
  messages: NarrativeLine[],
  reducedMotion: boolean,
): SpiritRevealState {
  const completedIds = new Set(state.completedIds);
  const seenIds = new Set(state.seenIds);
  const pendingIds = [...state.pendingIds];
  let activeId = state.activeId;

  for (const message of messages) {
    if (!isSpiritMessage(message) || seenIds.has(message.id)) continue;
    seenIds.add(message.id);

    if (reducedMotion) {
      completedIds.add(message.id);
      continue;
    }

    if (activeId === null && pendingIds.length === 0) {
      activeId = message.id;
    } else {
      pendingIds.push(message.id);
    }
  }

  return { ...state, activeId, pendingIds, completedIds, seenIds };
}

export function completeActiveMessage(state: SpiritRevealState): SpiritRevealState {
  if (!state.activeId) return state;

  const completedIds = new Set(state.completedIds);
  completedIds.add(state.activeId);

  return {
    ...state,
    activeId: null,
    completedIds,
  };
}

export function activateNextPending(state: SpiritRevealState): SpiritRevealState {
  if (state.pendingIds.length === 0) return state;

  const pendingIds = [...state.pendingIds];
  const activeId = pendingIds.shift()!;

  return { ...state, activeId, pendingIds };
}

export function getRevealPhase(
  state: SpiritRevealState,
  id: string,
  reducedMotion: boolean,
): RevealPhase {
  if (reducedMotion || state.completedIds.has(id)) return 'complete';
  if (state.activeId === id) return 'active';
  if (state.pendingIds.includes(id)) return 'pending';
  // Unseen or not yet queued — hide until the queue assigns active/pending
  return 'pending';
}

export function isRevealingState(state: SpiritRevealState): boolean {
  return state.activeId !== null || state.pendingIds.length > 0;
}

type UseSpiritRevealOptions = {
  sessionId: string;
  reducedMotion: boolean;
};

export function useSpiritReveal(
  messages: NarrativeLine[],
  { sessionId, reducedMotion }: UseSpiritRevealOptions,
) {
  const [state, setState] = useState<SpiritRevealState>(() =>
    createInitialState(sessionId, messages, reducedMotion),
  );
  const pauseRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionIdRef = useRef(sessionId);

  useEffect(() => {
    return () => {
      if (pauseRef.current) clearTimeout(pauseRef.current);
    };
  }, []);

  useLayoutEffect(() => {
    if (sessionId === sessionIdRef.current) return;
    sessionIdRef.current = sessionId;
    if (pauseRef.current) clearTimeout(pauseRef.current);
    setState(createInitialState(sessionId, messages, reducedMotion));
  }, [sessionId, messages, reducedMotion]);

  useLayoutEffect(() => {
    setState((prev) => {
      if (prev.sessionId !== sessionId) return prev;
      return enqueueNewSpiritIds(prev, messages, reducedMotion);
    });
  }, [messages, sessionId, reducedMotion]);

  const onMessageComplete = useCallback(
    (id: string) => {
      if (pauseRef.current) clearTimeout(pauseRef.current);

      setState((prev) => {
        if (prev.activeId !== id) return prev;
        const next = completeActiveMessage(prev);

        if (!reducedMotion && next.pendingIds.length > 0) {
          pauseRef.current = setTimeout(() => {
            setState((current) => {
              if (current.sessionId !== sessionId) return current;
              return activateNextPending(current);
            });
          }, REVEAL_LINE_MS);
        }

        return next;
      });
    },
    [sessionId, reducedMotion],
  );

  const getRevealPhaseForId = useCallback(
    (id: string) => getRevealPhase(state, id, reducedMotion),
    [state, reducedMotion],
  );

  return {
    isRevealing: isRevealingState(state),
    getRevealPhase: getRevealPhaseForId,
    onMessageComplete,
    activeId: state.activeId,
  };
}
