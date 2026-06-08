export type ChatRole = 'user' | 'assistant' | 'system';

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatRequest = {
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
};

export type ChatUsage = {
  inputTokens?: number;
  outputTokens?: number;
};

export type ChatResponse = {
  content: string;
  modelId: string;
  usage?: ChatUsage;
};

export type LlmPingResult = {
  ok: boolean;
  modelId: string;
};
