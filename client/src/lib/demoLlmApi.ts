export type DemoChatRole = 'user' | 'assistant' | 'system';

export type DemoChatMessage = {
  role: DemoChatRole;
  content: string;
};

export type DemoChatResponse = {
  reply: string;
  modelId: string;
  usage?: { inputTokens?: number; outputTokens?: number };
};

export type DemoLlmPingResponse = {
  ok: boolean;
  modelId: string;
  latencyMs: number;
};

export async function pingDemoLlm(): Promise<DemoLlmPingResponse | null> {
  try {
    const res = await fetch('/api/demo/llm-ping');
    if (!res.ok) return null;
    return (await res.json()) as DemoLlmPingResponse;
  } catch {
    return null;
  }
}

export async function sendDemoChat(
  text: string,
  history: DemoChatMessage[],
): Promise<DemoChatResponse> {
  const res = await fetch('/api/demo/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, history }),
  });
  if (!res.ok) {
    throw new Error(`Demo chat failed (${res.status})`);
  }
  return (await res.json()) as DemoChatResponse;
}
