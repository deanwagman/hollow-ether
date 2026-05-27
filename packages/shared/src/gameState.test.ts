import { describe, expect, it } from 'vitest';
import { applyInteract, createInitialSession } from './gameState';

describe('createInitialSession', () => {
  it('seeds opening line and met_luminia', () => {
    const state = createInitialSession();
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0].speaker).toBe('luminia');
    expect(state.flags.met_luminia).toBe(true);
    expect(state.currentScene).toBe('ch1_awakening');
  });
});

describe('applyInteract', () => {
  it('does not advance to invitation on first orientation message', () => {
    let state = createInitialSession();
    const next = applyInteract(state, 'who am I');
    expect(next).not.toBeNull();
    state = next!;
    expect(state.currentScene).toBe('ch1_awakening');
    expect(state.awakeningTurns).toBe(1);
  });

  it('advances to invitation after second turn with orientation', () => {
    let state = createInitialSession();
    state = applyInteract(state, 'hello')!;
    state = applyInteract(state, 'who am I')!;
    expect(state.currentScene).toBe('ch1_invitation');
    expect(state.awakeningTurns).toBe(2);
  });

  it('completes act 1 on invitation accept', () => {
    let state = createInitialSession();
    state = applyInteract(state, 'hello')!;
    state = applyInteract(state, 'who am I')!;
    state = applyInteract(state, 'I will listen for Elara')!;
    expect(state.flags.act1_invitation_accepted).toBe(true);
    expect(state.inputDisabled).toBe(true);
  });
});
