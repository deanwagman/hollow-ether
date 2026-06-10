import {
  hasOrientationTag,
  mentionsThalos,
  triesForbiddenSummon,
} from '../scenes';
import type { SceneId } from '../types';

export type LuminiaContext = {
  tags: string[];
  orientationThisTurn: boolean;
};

export function extractTags(text: string): string[] {
  const normalized = text.trim().toLowerCase();
  const tags: string[] = [];

  if (normalized.includes('who')) tags.push('who');
  if (normalized.includes('where')) tags.push('where');
  if (normalized.includes('what')) tags.push('what');
  if (normalized.includes('listen')) tags.push('listen');
  if (normalized.includes('witness')) tags.push('witness');
  if (normalized.includes('elara')) tags.push('elara');
  if (normalized.includes('court')) tags.push('court');
  if (normalized.includes('net') || normalized.includes('ether')) tags.push('net');
  if (normalized.includes('door') || normalized.includes('portal')) tags.push('door');
  if (normalized.includes('hurry') || normalized.includes('seize')) tags.push('rush');

  return tags;
}

export function buildContext(text: string): LuminiaContext {
  const tags = extractTags(text);
  return {
    tags,
    orientationThisTurn: hasOrientationTag(text),
  };
}

export function getSpiritLines(
  sceneId: SceneId,
  text: string,
  ctx: LuminiaContext,
): string[] {
  if (mentionsThalos(text)) {
    return [
      'That name is not for this hour.',
      'Listen first—the thread frays when mortals seize names too soon.',
    ];
  }

  if (triesForbiddenSummon(text)) {
    return [
      'Not yet. The net would scatter your call.',
      'You might listen for her—when you are ready to walk, not to command.',
    ];
  }

  if (sceneId === 'ch1_awakening') {
    return getAwakeningLines(ctx);
  }

  if (sceneId === 'ch1_invitation') {
    return getInvitationLines(ctx, text);
  }

  return getInvitationCommitLines(ctx, text);
}

function getAwakeningLines(ctx: LuminiaContext): string[] {
  const { tags } = ctx;

  if (tags.includes('who')) {
    return [
      'You are a Witness—one who hears because the net frays.',
      'I am Luminia. I keep the threads, not the throne.',
    ];
  }

  if (tags.includes('where')) {
    return [
      'You stand in the Ether Nexus—where signals cross before they choose a court.',
      'The horizon is empty on purpose. Listen before you walk.',
    ];
  }

  if (tags.includes('what') || tags.includes('net')) {
    return [
      'The Hollow Ether is a weave of courts—Tide, Gale, Root, and Ether.',
      'Something in the weave argues tonight. Listen before you walk toward it.',
    ];
  }

  if (tags.includes('listen')) {
    return [
      'Good. Listening is the first thread you must not break.',
      'On the Tide court, someone is accused—and the net repeats the accusation louder than the voice.',
    ];
  }

  if (tags.includes('witness')) {
    return [
      'Witness is not a title of power. It is a promise to hear before you judge.',
      'The fraying began where someone stopped listening.',
    ];
  }

  if (tags.includes('rush')) {
    return [
      'Patience. The net does not open to those who seize.',
      'Ask who you are, or where you stand—I will meet you there.',
    ];
  }

  if (tags.includes('elara')) {
    return [
      'A thread pulls at Tide—but you have not been invited to that shore yet.',
      'First, learn what it means to listen here.',
    ];
  }

  return ['The thread waits for your question.', 'Who are you—and where do you think you stand?'];
}

function getInvitationLines(ctx: LuminiaContext, text: string): string[] {
  const normalized = text.trim().toLowerCase();
  const { tags } = ctx;

  if (
    tags.includes('elara') ||
    normalized.includes('find her') ||
    normalized.includes('reflection')
  ) {
    const lines = [
      'Walk toward the Tide reflection pool. You will find her there—alone, and afraid of the net’s voice.',
      'Do not demand guilt. Listen as you listened here.',
    ];
    if (tags.includes('door') || normalized.includes('portal') || normalized.includes('future')) {
      lines.push(
        'There is a door on the horizon that must not open early. I will not name it—only warn you.',
      );
    }
    return lines;
  }

  if (tags.includes('door') || normalized.includes('portal') || normalized.includes('future')) {
    return [
      'A door waits where courts misalign. It must not open before the threads agree.',
      'Go to Elara first. The door can wait for a Witness who has listened.',
    ];
  }

  if (tags.includes('court')) {
    return [
      'Four courts braid the net—Ether, Tide, Gale, Root.',
      'Tonight, Tide weeps and Gale stutters. Find Elara; the rest will follow your patience.',
    ];
  }

  if (
    normalized.includes('yes') ||
    normalized.includes('listen for') ||
    normalized.includes('i will')
  ) {
    return [
      'You sound willing—but I need your explicit commitment before the path opens.',
      'Tell me plainly that you will listen for Elara on the Tide path.',
    ];
  }

  return [
    'The invitation stands: find Elara at the reflection pool.',
    'Ask about her, the courts, or the door—and when you are ready, say so plainly.',
  ];
}

function getInvitationCommitLines(ctx: LuminiaContext, text: string): string[] {
  const normalized = text.trim().toLowerCase();
  const { tags } = ctx;

  if (
    normalized.includes("don't") ||
    normalized.includes('do not') ||
    normalized.includes('refuse') ||
    normalized.includes('no ')
  ) {
    return [
      'I hear your hesitation. The net does not need a hero—only a Witness who listens.',
      'When you are ready, say that you will walk to Elara without demanding guilt.',
    ];
  }

  if (tags.includes('door') || normalized.includes('portal') || normalized.includes('future')) {
    return [
      'The door on the horizon must not open early. Walk to Elara first.',
      'When you commit, the Tide path will open—not the door.',
    ];
  }

  if (tags.includes('elara') || tags.includes('court')) {
    return [
      'Elara waits at the Tide reflection pool—alone, and afraid of the net’s voice.',
      'Will you go and listen before you judge?',
    ];
  }

  return [
    'This is the threshold. Say that you will listen for Elara—and the path opens.',
    'I will not choose for you.',
  ];
}

export const OPENING_LINE =
  'Witness—you wake where threads cross. Do not seize the net; listen, and I will show you who calls.';

export const ACT1_CLOSING_LINE =
  'Go. The Tide path opens. I will keep the nexus until you return—with truth, not rumor.';
