import { describe, expect, it, vi } from 'vitest';
import { createInitialSession } from '@ethernetic/shared';
import type { LlmProvider } from '../llm/llm.provider';
import { buildNarrativeHistory, getPromptTextForScene } from './narrative.prompt';
import { NarrativeService } from './narrative.service';

function createNarrativeService(llm: LlmProvider): NarrativeService {
  return new NarrativeService(llm);
}

describe('NarrativeService', () => {
  it('returns parsed lines from LLM response', async () => {
    const llm: LlmProvider = {
      chat: vi.fn().mockResolvedValue({
        content: 'First paragraph.\n\nSecond paragraph.',
        modelId: 'mock',
      }),
      ping: vi.fn(),
    };
    const service = createNarrativeService(llm);
    const state = createInitialSession();

    const lines = await service.generateSpiritLines(state, 'who am I');
    expect(lines).toEqual(['First paragraph.', 'Second paragraph.']);

    const chatMessages = vi.mocked(llm.chat).mock.calls[0][0].messages;
    const converseMessages = chatMessages.filter((m) => m.role !== 'system');
    expect(converseMessages[0]?.role).toBe('user');
  });

  it('falls back to mock spirit lines on empty LLM response', async () => {
    const llm: LlmProvider = {
      chat: vi.fn().mockResolvedValue({ content: '   ', modelId: 'mock' }),
      ping: vi.fn(),
    };
    const service = createNarrativeService(llm);
    const state = createInitialSession();

    const lines = await service.generateSpiritLines(state, 'who am I');
    expect(lines.some((line) => line.includes('Witness'))).toBe(true);
  });

  it('falls back to mock spirit lines when LLM throws', async () => {
    const llm: LlmProvider = {
      chat: vi.fn().mockRejectedValue(new Error('bedrock down')),
      ping: vi.fn(),
    };
    const service = createNarrativeService(llm);
    const state = createInitialSession();

    const lines = await service.generateSpiritLines(state, 'who am I');
    expect(lines.length).toBeGreaterThan(0);
  });
});

describe('buildNarrativeHistory', () => {
  it('drops leading assistant messages so Bedrock starts with user', () => {
    const state = createInitialSession();
    expect(buildNarrativeHistory(state)).toEqual([]);
  });
});

describe('scene-scoped prompts', () => {
  it('includes awakening content but not invitation scene header for awakening', () => {
    const prompt = getPromptTextForScene('ch1_awakening');
    expect(prompt).toContain('ch1_awakening');
    expect(prompt).not.toContain('Scene: Invitation');
  });

  it('includes invitation content for invitation scene', () => {
    const prompt = getPromptTextForScene('ch1_invitation');
    expect(prompt).toContain('ch1_invitation');
    expect(prompt).toContain('Scene: Invitation');
    expect(prompt).not.toContain('Scene: Awakening');
  });
});
