import { describe, expect, it, vi } from 'vitest';
import {
  applyInteract,
  createInitialSession,
  type GameState,
} from '@hollow-ether/shared';
import type { LlmProvider } from '../llm/llm.provider';
import { NarrativeService } from '../narrative/narrative.service';
import { SessionService } from './session.service';
import type { SessionStore } from './session.store';

function createSessionService(options: {
  narrativeProvider: 'llm' | 'mock';
  llm: LlmProvider;
}) {
  const store: SessionStore = {
    create: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
  } as unknown as SessionStore;

  const config = {
    get: (key: string) =>
      key === 'NARRATIVE_PROVIDER' ? options.narrativeProvider : undefined,
  };

  const narrative = new NarrativeService(options.llm);
  const service = new SessionService(store, narrative, config as never);
  return { service, llm: options.llm };
}

async function reachInvitationCommit(): Promise<GameState> {
  let state = createInitialSession();
  state = applyInteract(state, 'hello')!;
  state = applyInteract(state, 'who am I')!;
  state = applyInteract(state, 'tell me about Elara')!;
  return state;
}

describe('SessionService rules-first interact', () => {
  it('does not call LLM when accept phrase triggers replaceSpiritLines in commit', async () => {
    const state = await reachInvitationCommit();

    const chat = vi.fn().mockResolvedValue({
      content: 'LLM should not appear',
      modelId: 'mock',
    });
    const { service } = createSessionService({
      narrativeProvider: 'llm',
      llm: { chat, ping: vi.fn() },
    });

    const next = await service.applyPlayerInteract(
      state,
      "I'm ready to listen for Elara",
    );

    expect(chat).not.toHaveBeenCalled();
    expect(next!.flags.act1_invitation_accepted).toBe(true);
    const lastLuminia = next!.messages.filter((m) => m.speaker === 'luminia').at(-1);
    expect(lastLuminia?.text).not.toContain('LLM should not appear');
  });

  it('calls LLM for normal invitation turn', async () => {
    let state: GameState = createInitialSession();
    state = applyInteract(state, 'hello')!;
    state = applyInteract(state, 'who am I')!;

    const chat = vi.fn().mockResolvedValue({
      content: 'Invitation from the LLM.',
      modelId: 'mock',
    });
    const { service } = createSessionService({
      narrativeProvider: 'llm',
      llm: { chat, ping: vi.fn() },
    });

    await service.applyPlayerInteract(state, 'tell me about the courts');

    expect(chat).toHaveBeenCalledOnce();
  });
});
