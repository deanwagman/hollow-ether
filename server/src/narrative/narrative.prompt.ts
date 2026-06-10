import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import type { GameFlags, GameState, SceneId } from '@hollow-ether/shared';

const PROMPT_SUFFIX =
  'Reply as Luminia in one short paragraph (2–3 sentences). No JSON. Do not advance the scene or mention beats from other scenes. Do not repeat your previous reply.';

const promptCache: Partial<Record<string, string>> = {};

function scenePromptFilename(sceneId: SceneId): string {
  switch (sceneId) {
    case 'ch1_awakening':
      return 'luminia-awakening.md';
    case 'ch1_invitation':
      return 'luminia-invitation.md';
    case 'ch1_invitation_commit':
      return 'luminia-invitation-commit.md';
  }
}

function promptsDir(): string {
  const candidates = [
    join(__dirname, 'prompts'),
    join(__dirname, '..', '..', 'narrative', 'prompts'),
    join(process.cwd(), 'src', 'narrative', 'prompts'),
  ];

  for (const dir of candidates) {
    if (existsSync(join(dir, 'luminia-base.md'))) {
      return dir;
    }
  }

  throw new Error(
    `Luminia prompt files not found. Tried: ${candidates.join(', ')}`,
  );
}

function readPrompt(filename: string): string {
  if (!promptCache[filename]) {
    promptCache[filename] = readFileSync(
      join(promptsDir(), filename),
      'utf8',
    ).trim();
  }
  return promptCache[filename]!;
}

export function buildLuminiaSystemPrompt(sceneId: SceneId, flags: GameFlags): string {
  const scenePrompt = readPrompt(scenePromptFilename(sceneId));

  const flagSummary = [
    `met_luminia=${flags.met_luminia}`,
    `luminia_trust=${flags.luminia_trust}`,
    `luminia_warned_door=${flags.luminia_warned_door}`,
    `act1_invitation_accepted=${flags.act1_invitation_accepted}`,
  ].join(', ');

  return [
    readPrompt('luminia-base.md'),
    PROMPT_SUFFIX,
    `Current scene: ${sceneId}`,
    `Flags: ${flagSummary}`,
    scenePrompt,
  ].join('\n\n');
}

export function buildNarrativeHistory(
  state: GameState,
  maxMessages = 20,
): { role: 'user' | 'assistant'; content: string }[] {
  const recent = state.messages.slice(-maxMessages);
  const mapped = recent.map((message) => ({
    role: message.speaker === 'player' ? ('user' as const) : ('assistant' as const),
    content: message.text,
  }));

  // Bedrock Converse requires the message list to start with a user turn.
  let start = 0;
  while (start < mapped.length && mapped[start].role === 'assistant') {
    start += 1;
  }

  return mapped.slice(start);
}

export function parseSpiritLines(content: string): string[] {
  const trimmed = content.trim();
  if (!trimmed) return [];

  const paragraphs = trimmed
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return paragraphs.length <= 2 ? paragraphs : paragraphs.slice(0, 2);
}

export function resetPromptCache(): void {
  for (const key of Object.keys(promptCache)) {
    delete promptCache[key];
  }
}

export function getPromptTextForScene(sceneId: SceneId): string {
  return buildLuminiaSystemPrompt(sceneId, {
    met_luminia: true,
    luminia_trust: false,
    luminia_warned_door: false,
    act1_invitation_accepted: false,
  });
}
