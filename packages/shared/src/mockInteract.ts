import { buildContext, getSpiritLines } from './mock/luminia';
import { resolveInteractRules } from './interactRules';
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
  const rules = resolveInteractRules(sceneId, playerText, flags, meta);
  const spiritLines = getSpiritLines(sceneId, playerText, ctx);
  const mergedSpiritLines = rules.replaceSpiritLines ?? [
    ...spiritLines,
    ...rules.appendSpiritLines,
  ];

  return {
    spiritLines: mergedSpiritLines,
    flagUpdates: rules.flagUpdates,
    nextScene: rules.nextScene,
  };
}
