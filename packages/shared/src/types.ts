export type SceneId =
  | 'ch1_awakening'
  | 'ch1_invitation'
  | 'ch1_invitation_commit';

export type SpiritId = 'luminia';

export type SpeakerId = 'player' | SpiritId;

export type GameFlags = {
  met_luminia: boolean;
  luminia_trust: boolean;
  luminia_warned_door: boolean;
  act1_invitation_accepted: boolean;
};

export type NarrativeLine = {
  id: string;
  speaker: SpeakerId;
  text: string;
};

export const INITIAL_FLAGS: GameFlags = {
  met_luminia: false,
  luminia_trust: false,
  luminia_warned_door: false,
  act1_invitation_accepted: false,
};

export type InteractMeta = {
  awakeningTurns: number;
  awakeningOrientationSeen: boolean;
  invitationTurns: number;
};

export type InteractResult = {
  spiritLines: string[];
  flagUpdates: Partial<GameFlags>;
  nextScene?: SceneId;
};

export type GameState = {
  currentScene: SceneId;
  activeSpirit: SpiritId;
  flags: GameFlags;
  messages: NarrativeLine[];
  awakeningTurns: number;
  awakeningOrientationSeen: boolean;
  invitationTurns: number;
  inputDisabled: boolean;
};

export type SessionPayload = {
  sessionId: string;
  state: GameState;
};
