import { describe, expect, it } from 'vitest';
import { ACT1_CLOSING_LINE } from './mock/luminia';
import { resolveInteractRules } from './interactRules';
import { INITIAL_FLAGS } from './types';

const baseMeta = {
  awakeningTurns: 0,
  awakeningOrientationSeen: false,
  invitationTurns: 0,
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
      { awakeningTurns: 1, awakeningOrientationSeen: true, invitationTurns: 0 },
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

  it('does not accept in invitation scene', () => {
    const rules = resolveInteractRules(
      'ch1_invitation',
      "I'm ready to listen for Elara",
      INITIAL_FLAGS,
      { ...baseMeta, invitationTurns: 1 },
    );
    expect(rules.flagUpdates.act1_invitation_accepted).toBeUndefined();
    expect(rules.replaceSpiritLines).toBeUndefined();
  });

  it('enters invitation commit after topic or second invitation turn', () => {
    const withTopic = resolveInteractRules(
      'ch1_invitation',
      'tell me about Elara',
      INITIAL_FLAGS,
      baseMeta,
    );
    expect(withTopic.nextScene).toBe('ch1_invitation_commit');

    const secondTurn = resolveInteractRules(
      'ch1_invitation',
      'still thinking',
      INITIAL_FLAGS,
      { ...baseMeta, invitationTurns: 1 },
    );
    expect(secondTurn.nextScene).toBe('ch1_invitation_commit');
  });

  it('sets accept flag and replaceSpiritLines only in commit scene', () => {
    const rules = resolveInteractRules(
      'ch1_invitation_commit',
      "I'm ready to listen for Elara",
      INITIAL_FLAGS,
      { ...baseMeta, invitationTurns: 1 },
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
