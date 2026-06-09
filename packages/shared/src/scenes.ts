import type { GameFlags, SceneId } from './types';

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
  ch1_invitation_commit: {
    id: 'ch1_invitation_commit',
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

const ACCEPT_TAGS = [
  'elara',
  'find her',
  'yes',
  'listen for',
  'i will listen',
  'i will find',
  "i'm ready",
  'i will go',
  'lead me',
  'take me',
  'ready to listen',
  "let's go",
];

export function canCompleteAct1(sceneId: SceneId, text: string): boolean {
  if (sceneId !== 'ch1_invitation_commit') return false;
  return hasAnyTag(text, ACCEPT_TAGS);
}

const INVITATION_TOPIC_TAGS = [
  'elara',
  'court',
  'courts',
  'door',
  'portal',
  'reflection',
  'tide',
];

export function asksAboutInvitationTopic(text: string): boolean {
  return hasAnyTag(text, INVITATION_TOPIC_TAGS);
}

export function canEnterInvitationCommit(
  invitationTurnsIncludingCurrent: number,
  flags: GameFlags,
  playerText: string,
): boolean {
  if (invitationTurnsIncludingCurrent >= 2) return true;
  if (invitationTurnsIncludingCurrent >= 1) {
    if (flags.luminia_trust) return true;
    if (asksAboutInvitationTopic(playerText)) return true;
  }
  return false;
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
