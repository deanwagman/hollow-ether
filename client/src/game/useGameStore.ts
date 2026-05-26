import { create } from 'zustand';
import { hasOrientationTag } from './scenes';
import { mockInteract } from './mockInteract';
import { OPENING_LINE } from './mock/luminia';
import {
  INITIAL_FLAGS,
  type GameFlags,
  type NarrativeLine,
  type SceneId,
  type SpiritId,
} from './types';

function nextMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function line(speaker: NarrativeLine['speaker'], text: string): NarrativeLine {
  return { id: nextMessageId(), speaker, text };
}

type GameStoreState = {
  currentScene: SceneId;
  activeSpirit: SpiritId;
  flags: GameFlags;
  messages: NarrativeLine[];
  awakeningTurns: number;
  awakeningOrientationSeen: boolean;
  inputDisabled: boolean;
  seeded: boolean;

  submitInput: (text: string) => void;
  seedOpening: () => void;
  resetGame: () => void;
};

const initialState = {
  currentScene: 'ch1_awakening' as SceneId,
  activeSpirit: 'luminia' as SpiritId,
  flags: { ...INITIAL_FLAGS },
  messages: [] as NarrativeLine[],
  awakeningTurns: 0,
  awakeningOrientationSeen: false,
  inputDisabled: false,
  seeded: false,
};

export const useGameStore = create<GameStoreState>((set, get) => ({
  ...initialState,

  seedOpening: () => {
    if (get().seeded) return;
    set({
      seeded: true,
      messages: [line('luminia', OPENING_LINE)],
      flags: { ...get().flags, met_luminia: true },
    });
  },

  submitInput: (text: string) => {
    const state = get();
    if (state.inputDisabled) return;

    const trimmed = text.trim();
    if (!trimmed) return;

    const orientationThisTurn =
      state.currentScene === 'ch1_awakening' && hasOrientationTag(trimmed);

    set((s) => ({
      messages: [...s.messages, line('player', trimmed)],
      awakeningOrientationSeen:
        s.awakeningOrientationSeen || orientationThisTurn,
    }));

    const afterPlayer = get();
    const result = mockInteract(
      afterPlayer.currentScene,
      trimmed,
      afterPlayer.flags,
      {
        awakeningTurns: afterPlayer.awakeningTurns,
        awakeningOrientationSeen: afterPlayer.awakeningOrientationSeen,
      },
    );

    const spiritMessages = result.spiritLines.map((t) => line('luminia', t));
    const mergedFlags = { ...afterPlayer.flags, ...result.flagUpdates };
    const act1Complete = mergedFlags.act1_invitation_accepted;

    set((s) => ({
      messages: [...s.messages, ...spiritMessages],
      flags: mergedFlags,
      currentScene: result.nextScene ?? s.currentScene,
      inputDisabled: act1Complete,
      awakeningTurns:
        s.currentScene === 'ch1_awakening'
          ? s.awakeningTurns + 1
          : s.awakeningTurns,
    }));
  },

  resetGame: () => {
    set({ ...initialState, flags: { ...INITIAL_FLAGS } });
    get().seedOpening();
  },
}));
