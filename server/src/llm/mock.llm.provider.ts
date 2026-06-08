import type { LlmProvider } from './llm.provider';
import type { ChatRequest, ChatResponse, LlmPingResult } from './llm.types';

export class MockLlmProvider implements LlmProvider {
  async chat(request: ChatRequest): Promise<ChatResponse> {
    const lastUser = [...request.messages].reverse().find((m) => m.role === 'user');
    const text = lastUser?.content?.trim() || 'ping';
    return {
      content: `[mock] Echo: ${text}`,
      modelId: 'mock',
    };
  }

  async ping(): Promise<LlmPingResult> {
    return { ok: true, modelId: 'mock' };
  }
}
