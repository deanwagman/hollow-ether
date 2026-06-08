import { describe, expect, it } from 'vitest';
import { ACT1_CLOSING_LINE } from './mock/luminia';
import { resolveInteractRules } from './interactRules';
import { INITIAL_FLAGS } from './types';

const baseMeta = {
  awakeningTurns: 0,
  awakeningOrientationSeen: false,
};

describe('resolveInteractRules', () => {
  it('does not advance on first orientation turn', () => {
    const rules = resolveInteractRules(
      'ch1_awakening',
      'who am I',
      INITIAL_FLAGS,
      { ...baseMeta, awakeningOrientationSeen: true },
    );
    expect(rules.nextScene).toBeUndefined();
    expect(rules.appendSpiritLines).toHaveLength(0);
  });

  it('advances to invitation after second turn with orientation', () => {
    const rules = resolveInteractRules(
      'ch1_awakening',
      'tell me more',
      INITIAL_FLAGS,
      { awakeningTurns: 1, awakeningOrientationSeen: true },
    );
    expect(rules.nextScene).toBe('ch1_invitation');
    expect(rules.appendSpiritLines.length).toBeGreaterThan(0);
  });

  it('sets luminia_warned_door on door mention in invitation', () => {
    const rules = resolveInteractRules(
      'ch1_invitation',
      'what about the door',
      INITIAL_FLAGS,
      baseMeta,
    );
    expect(rules.flagUpdates.luminia_warned_door).toBe(true);
  });

  it('sets accept flag and replaceSpiritLines on accept phrase', () => {
    const rules = resolveInteractRules(
      'ch1_invitation',
      'I will listen for Elara',
      INITIAL_FLAGS,
      baseMeta,
    );
    expect(rules.flagUpdates.act1_invitation_accepted).toBe(true);
    expect(rules.replaceSpiritLines).toEqual([ACT1_CLOSING_LINE]);
  });

  it('sets luminia_trust for patient keywords without rush', () => {
    const rules = resolveInteractRules(
      'ch1_awakening',
      'I will listen gently',
      INITIAL_FLAGS,
      baseMeta,
    );
    expect(rules.flagUpdates.luminia_trust).toBe(true);
  });
});
