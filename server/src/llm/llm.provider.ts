import type { ChatRequest, ChatResponse, LlmPingResult } from './llm.types';

export interface LlmProvider {
  chat(request: ChatRequest): Promise<ChatResponse>;
  ping(): Promise<LlmPingResult>;
}

export const LLM_PROVIDER = Symbol('LLM_PROVIDER');
