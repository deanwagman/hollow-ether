import { describe, expect, it } from 'vitest';
import type { NarrativeLine } from './types';
import {
  activateNextPending,
  completeActiveMessage,
  createInitialState,
  enqueueNewSpiritIds,
  getRevealPhase,
  shouldAnimateOpening,
} from './useSpiritReveal';

function line(
  id: string,
  speaker: NarrativeLine['speaker'],
  text: string,
): NarrativeLine {
  return { id, speaker, text };
}

describe('shouldAnimateOpening', () => {
  it('enqueues single spirit message on fresh session', () => {
    const messages = [line('s1', 'luminia', 'Awakening…')];
    expect(shouldAnimateOpening(messages, false)).toBe(true);
  });

  it('skips when history is present', () => {
    const messages = [
      line('s1', 'luminia', 'Opening'),
      line('p1', 'player', 'Hi'),
    ];
    expect(shouldAnimateOpening(messages, false)).toBe(false);
  });
});

describe('createInitialState', () => {
  it('marks restored multi-message session complete', () => {
    const messages = [
      line('s1', 'luminia', 'Opening'),
      line('p1', 'player', 'Hi'),
      line('s2', 'luminia', 'Reply'),
    ];
    const state = createInitialState('session-a', messages, false);
    expect(state.activeId).toBeNull();
    expect(state.completedIds.has('s1')).toBe(true);
    expect(state.completedIds.has('s2')).toBe(true);
  });

  it('activates opening line on fresh session', () => {
    const messages = [line('s1', 'luminia', 'Opening')];
    const state = createInitialState('session-a', messages, false);
    expect(state.activeId).toBe('s1');
    expect(state.completedIds.size).toBe(0);
  });

  it('completes all spirit lines when reduced motion', () => {
    const messages = [line('s1', 'luminia', 'Opening')];
    const state = createInitialState('session-a', messages, true);
    expect(state.activeId).toBeNull();
    expect(state.completedIds.has('s1')).toBe(true);
  });
});

describe('enqueueNewSpiritIds', () => {
  it('queues two spirit lines from one update sequentially', () => {
    const state = {
      sessionId: 'session-a',
      activeId: null,
      pendingIds: [] as string[],
      completedIds: new Set(['s1']),
      seenIds: new Set(['s1']),
    };

    const messages = [
      line('s1', 'luminia', 'One'),
      line('s2', 'luminia', 'Two'),
      line('s3', 'luminia', 'Three'),
    ];
    const next = enqueueNewSpiritIds(state, messages, false);

    expect(next.activeId).toBe('s2');
    expect(next.pendingIds).toEqual(['s3']);
  });

  it('never queues player messages', () => {
    const state = createInitialState('session-a', [line('s1', 'luminia', 'Hi')], false);
    const next = enqueueNewSpiritIds(
      state,
      [
        line('s1', 'luminia', 'Hi'),
        line('p1', 'player', 'Hello'),
      ],
      false,
    );
    expect(next.pendingIds).not.toContain('p1');
    expect(next.completedIds.has('p1')).toBe(false);
  });
});

describe('session reset', () => {
  it('resets queue when sessionId changes', () => {
    const restored = createInitialState(
      'session-b',
      [
        line('s1', 'luminia', 'Opening'),
        line('p1', 'player', 'Hi'),
      ],
      false,
    );
    expect(restored.activeId).toBeNull();
    expect(restored.completedIds.has('s1')).toBe(true);

    const fresh = createInitialState('session-c', [line('s9', 'luminia', 'New opening')], false);
    expect(fresh.sessionId).toBe('session-c');
    expect(fresh.activeId).toBe('s9');
  });
});

describe('getRevealPhase', () => {
  it('returns pending for spirit ids not yet in the queue', () => {
    const state = createInitialState('session-a', [], false);
    expect(getRevealPhase(state, 's-new', false)).toBe('pending');
  });
});

describe('queue advancement', () => {
  it('second line becomes active after first completes and advance', () => {
    let state = createInitialState('session-a', [line('s1', 'luminia', 'One')], false);
    expect(state.activeId).toBe('s1');

    const batch = [
      line('s1', 'luminia', 'One'),
      line('s2', 'luminia', 'Two'),
    ];
    state = enqueueNewSpiritIds(state, batch, false);
    expect(state.activeId).toBe('s1');
    expect(state.pendingIds).toEqual(['s2']);

    state = completeActiveMessage(state);
    expect(getRevealPhase(state, 's1', false)).toBe('complete');
    expect(getRevealPhase(state, 's2', false)).toBe('pending');

    state = activateNextPending(state);
    expect(state.activeId).toBe('s2');
    expect(getRevealPhase(state, 's2', false)).toBe('active');
  });
});
