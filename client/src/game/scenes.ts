import type { SceneId } from './types';

export const ORIENTATION_TAGS = ['who', 'where', 'what', 'listen', 'witness'] as const;

export const AWAKENING_MIN_TURNS = 2;

export type SceneMeta = {
  id: SceneId;
  label: string;
  activeSpirit: 'luminia';
};

export const SCENES: Record<SceneId, SceneMeta> = {
  ch1_awakening: {
    id: 'ch1_awakening',
    label: 'Awakening',
    activeSpirit: 'luminia',
  },
  ch1_invitation: {
    id: 'ch1_invitation',
    label: 'Invitation',
    activeSpirit: 'luminia',
  },
};

export function normalizeText(text: string): string {
  return text.trim().toLowerCase();
}

export function hasAnyTag(text: string, tags: readonly string[]): boolean {
  const normalized = normalizeText(text);
  return tags.some((tag) => normalized.includes(tag));
}

export function hasOrientationTag(text: string): boolean {
  return hasAnyTag(text, ORIENTATION_TAGS);
}

export function canLeaveAwakening(
  turnsIncludingCurrent: number,
  awakeningOrientationSeen: boolean,
): boolean {
  return turnsIncludingCurrent >= AWAKENING_MIN_TURNS && awakeningOrientationSeen;
}

const ACCEPT_TAGS = ['elara', 'find her', 'yes', 'listen for', 'i will listen', 'i will find'];

export function canCompleteAct1(text: string): boolean {
  return hasAnyTag(text, ACCEPT_TAGS);
}

const RUSH_TAGS = ['hurry', 'seize', 'now'];
const PATIENT_TAGS = ['listen', 'wait', 'gentle'];

export function earnsLuminiaTrust(text: string): boolean {
  return hasAnyTag(text, PATIENT_TAGS) && !hasAnyTag(text, RUSH_TAGS);
}

const DOOR_TAGS = ['door', 'portal', 'future', 'threshold'];

export function asksAboutDoor(text: string): boolean {
  return hasAnyTag(text, DOOR_TAGS);
}

const FORBIDDEN_SUMMON = ['call elara', 'summon elara', 'bring elara', 'summon zephyr', 'call zephyr'];

export function triesForbiddenSummon(text: string): boolean {
  return hasAnyTag(text, FORBIDDEN_SUMMON);
}

export function mentionsThalos(text: string): boolean {
  return normalizeText(text).includes('thalos');
}
