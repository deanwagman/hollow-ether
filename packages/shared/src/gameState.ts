import { buildInteractMeta, resolveInteractRules } from './interactRules';
import type { InteractRulesResult } from './interactRules';
import { buildContext, getSpiritLines, OPENING_LINE } from './mock/luminia';
import {
  INITIAL_FLAGS,
  type GameState,
  type NarrativeLine,
  type SceneId,
  type SpiritId,
} from './types';

export function nextMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function line(speaker: NarrativeLine['speaker'], text: string): NarrativeLine {
  return { id: nextMessageId(), speaker, text };
}

const baseState = (): Omit<GameState, 'messages' | 'flags'> => ({
  currentScene: 'ch1_awakening' as SceneId,
  activeSpirit: 'luminia' as SpiritId,
  awakeningTurns: 0,
  awakeningOrientationSeen: false,
  invitationTurns: 0,
  inputDisabled: false,
});

export function createInitialSession(): GameState {
  return {
    ...baseState(),
    flags: { ...INITIAL_FLAGS, met_luminia: true },
    messages: [line('luminia', OPENING_LINE)],
  };
}

export function applyInteractWithSpiritLines(
  state: GameState,
  playerText: string,
  spiritLines: string[],
  rules?: InteractRulesResult,
): GameState | null {
  if (state.inputDisabled) return null;

  const trimmed = playerText.trim();
  if (!trimmed) return null;

  const { meta, awakeningOrientationSeen } = buildInteractMeta(state, trimmed);
  const resolvedRules =
    rules ??
    resolveInteractRules(state.currentScene, trimmed, state.flags, {
      ...meta,
      awakeningOrientationSeen,
    });

  const finalSpiritLines =
    resolvedRules.replaceSpiritLines ?? [
      ...spiritLines,
      ...resolvedRules.appendSpiritLines,
    ];

  const messagesAfterPlayer = [...state.messages, line('player', trimmed)];
  const spiritMessages = finalSpiritLines.map((t) => line('luminia', t));
  const mergedFlags = { ...state.flags, ...resolvedRules.flagUpdates };
  const act1Complete = mergedFlags.act1_invitation_accepted;

  return {
    ...state,
    messages: [...messagesAfterPlayer, ...spiritMessages],
    flags: mergedFlags,
    currentScene: resolvedRules.nextScene ?? state.currentScene,
    inputDisabled: act1Complete,
    awakeningOrientationSeen,
    awakeningTurns:
      state.currentScene === 'ch1_awakening'
        ? state.awakeningTurns + 1
        : state.awakeningTurns,
    invitationTurns:
      state.currentScene === 'ch1_invitation' ||
      state.currentScene === 'ch1_invitation_commit'
        ? state.invitationTurns + 1
        : state.invitationTurns,
  };
}

export function applyInteract(state: GameState, playerText: string): GameState | null {
  const trimmed = playerText.trim();
  if (!trimmed || state.inputDisabled) return null;

  const { meta, awakeningOrientationSeen } = buildInteractMeta(state, trimmed);
  const ctx = buildContext(trimmed);
  const spiritLines = getSpiritLines(state.currentScene, trimmed, ctx);
  const rules = resolveInteractRules(state.currentScene, trimmed, state.flags, {
    ...meta,
    awakeningOrientationSeen,
  });

  return applyInteractWithSpiritLines(state, trimmed, spiritLines, rules);
}
