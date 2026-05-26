import {
  asksAboutDoor,
  canCompleteAct1,
  canLeaveAwakening,
  earnsLuminiaTrust,
} from './scenes';
import {
  ACT1_CLOSING_LINE,
  buildContext,
  getSpiritLines,
} from './mock/luminia';
import type {
  GameFlags,
  InteractMeta,
  InteractResult,
  SceneId,
} from './types';

export function mockInteract(
  sceneId: SceneId,
  playerText: string,
  flags: GameFlags,
  meta: InteractMeta,
): InteractResult {
  const ctx = buildContext(playerText);
  const flagUpdates: Partial<GameFlags> = {};
  const turnsIncludingCurrent = meta.awakeningTurns + 1;
  const orientationSeen =
    meta.awakeningOrientationSeen || ctx.orientationThisTurn;

  if (earnsLuminiaTrust(playerText)) {
    flagUpdates.luminia_trust = true;
  }

  let spiritLines = getSpiritLines(sceneId, playerText, ctx);
  let nextScene: SceneId | undefined;

  if (sceneId === 'ch1_awakening') {
    if (canLeaveAwakening(turnsIncludingCurrent, orientationSeen)) {
      nextScene = 'ch1_invitation';
      spiritLines = [
        ...spiritLines,
        'You have asked enough to stand. Now hear my invitation.',
        'Someone on the Tide court needs a Witness who listens before they judge.',
      ];
    }
  } else if (sceneId === 'ch1_invitation') {
    if (asksAboutDoor(playerText)) {
      flagUpdates.luminia_warned_door = true;
    }

    if (canCompleteAct1(playerText)) {
      flagUpdates.act1_invitation_accepted = true;
      spiritLines = [ACT1_CLOSING_LINE];
    }
  }

  return { spiritLines, flagUpdates, nextScene };
}
