import {
  asksAboutDoor,
  canCompleteAct1,
  canLeaveAwakening,
  earnsLuminiaTrust,
  hasOrientationTag,
} from './scenes';
import { ACT1_CLOSING_LINE, buildContext } from './mock/luminia';
import type { GameFlags, GameState, InteractMeta, SceneId } from './types';

export type InteractRulesResult = {
  flagUpdates: Partial<GameFlags>;
  nextScene?: SceneId;
  appendSpiritLines: string[];
  replaceSpiritLines?: string[];
};

const AWAKENING_TRANSITION_LINES = [
  'You have asked enough to stand. Now hear my invitation.',
  'Someone on the Tide court needs a Witness who listens before they judge.',
];

export function buildInteractMeta(state: GameState, playerText: string) {
  const trimmed = playerText.trim();
  const orientationThisTurn =
    state.currentScene === 'ch1_awakening' && hasOrientationTag(trimmed);
  const awakeningOrientationSeen =
    state.awakeningOrientationSeen || orientationThisTurn;

  return {
    meta: {
      awakeningTurns: state.awakeningTurns,
      awakeningOrientationSeen,
    },
    awakeningOrientationSeen,
  };
}

export function resolveInteractRules(
  sceneId: SceneId,
  playerText: string,
  _flags: GameFlags,
  meta: InteractMeta,
): InteractRulesResult {
  const ctx = buildContext(playerText);
  const flagUpdates: Partial<GameFlags> = {};
  const appendSpiritLines: string[] = [];
  let nextScene: SceneId | undefined;
  let replaceSpiritLines: string[] | undefined;

  const turnsIncludingCurrent = meta.awakeningTurns + 1;
  const orientationSeen =
    meta.awakeningOrientationSeen || ctx.orientationThisTurn;

  if (earnsLuminiaTrust(playerText)) {
    flagUpdates.luminia_trust = true;
  }

  if (sceneId === 'ch1_awakening') {
    if (canLeaveAwakening(turnsIncludingCurrent, orientationSeen)) {
      nextScene = 'ch1_invitation';
      appendSpiritLines.push(...AWAKENING_TRANSITION_LINES);
    }
  } else if (sceneId === 'ch1_invitation') {
    if (asksAboutDoor(playerText)) {
      flagUpdates.luminia_warned_door = true;
    }

    if (canCompleteAct1(playerText)) {
      flagUpdates.act1_invitation_accepted = true;
      replaceSpiritLines = [ACT1_CLOSING_LINE];
    }
  }

  return {
    flagUpdates,
    nextScene,
    appendSpiritLines,
    replaceSpiritLines,
  };
}
