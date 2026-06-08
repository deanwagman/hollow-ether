import { describe, expect, it } from 'vitest';
import {
  applyInteract,
  applyInteractWithSpiritLines,
  createInitialSession,
} from './gameState';
import { ACT1_CLOSING_LINE } from './mock/luminia';
import { resolveInteractRules } from './interactRules';

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

describe('applyInteractWithSpiritLines', () => {
  it('includes custom spirit lines from LLM path', () => {
    const state = createInitialSession();
    const next = applyInteractWithSpiritLines(state, 'hello', ['LLM line']);
    expect(next).not.toBeNull();
    const luminiaTexts = next!.messages
      .filter((m) => m.speaker === 'luminia')
      .map((m) => m.text);
    expect(luminiaTexts).toContain('LLM line');
  });

  it('uses replaceSpiritLines from precomputed rules on accept', () => {
    let state = createInitialSession();
    state = applyInteract(state, 'hello')!;
    state = applyInteract(state, 'who am I')!;
    state = {
      ...state,
      currentScene: 'ch1_invitation',
    };

    const rules = resolveInteractRules(
      'ch1_invitation',
      'I will listen for Elara',
      state.flags,
      { awakeningTurns: 2, awakeningOrientationSeen: true },
    );
    const next = applyInteractWithSpiritLines(
      state,
      'I will listen for Elara',
      ['This LLM line should be ignored'],
      rules,
    );

    expect(next!.flags.act1_invitation_accepted).toBe(true);
    const lastLuminia = next!.messages.filter((m) => m.speaker === 'luminia').at(-1);
    expect(lastLuminia?.text).toBe(ACT1_CLOSING_LINE);
  });
});
