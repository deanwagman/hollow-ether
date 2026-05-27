import { hasOrientationTag } from './scenes';
import { mockInteract } from './mockInteract';
import { OPENING_LINE } from './mock/luminia';
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
  inputDisabled: false,
});

export function createInitialSession(): GameState {
  return {
    ...baseState(),
    flags: { ...INITIAL_FLAGS, met_luminia: true },
    messages: [line('luminia', OPENING_LINE)],
  };
}

export function applyInteract(state: GameState, playerText: string): GameState | null {
  if (state.inputDisabled) return null;

  const trimmed = playerText.trim();
  if (!trimmed) return null;

  const orientationThisTurn =
    state.currentScene === 'ch1_awakening' && hasOrientationTag(trimmed);

  const awakeningOrientationSeen =
    state.awakeningOrientationSeen || orientationThisTurn;

  const messagesAfterPlayer = [...state.messages, line('player', trimmed)];

  const result = mockInteract(state.currentScene, trimmed, state.flags, {
    awakeningTurns: state.awakeningTurns,
    awakeningOrientationSeen,
  });

  const spiritMessages = result.spiritLines.map((t) => line('luminia', t));
  const mergedFlags = { ...state.flags, ...result.flagUpdates };
  const act1Complete = mergedFlags.act1_invitation_accepted;

  return {
    ...state,
    messages: [...messagesAfterPlayer, ...spiritMessages],
    flags: mergedFlags,
    currentScene: result.nextScene ?? state.currentScene,
    inputDisabled: act1Complete,
    awakeningOrientationSeen,
    awakeningTurns:
      state.currentScene === 'ch1_awakening'
        ? state.awakeningTurns + 1
        : state.awakeningTurns,
  };
}
