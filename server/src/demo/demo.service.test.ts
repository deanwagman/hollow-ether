import { describe, expect, it } from 'vitest';
import { MockLlmProvider } from '../llm/mock.llm.provider';
import { DemoService } from './demo.service';

function createDemoService() {
  const config = {
    get: (key: string, fallback?: string) => {
      if (key === 'DEMO_LLM_MAX_TOKENS') return '512';
      return fallback;
    },
  };
  return new DemoService(new MockLlmProvider(), config as never);
}

describe('MockLlmProvider', () => {
  it('echoes the last user message', async () => {
    const llm = new MockLlmProvider();
    const response = await llm.chat({
      messages: [
        { role: 'system', content: 'test' },
        { role: 'user', content: 'Hello Bedrock' },
      ],
    });
    expect(response.content).toBe('[mock] Echo: Hello Bedrock');
    expect(response.modelId).toBe('mock');
  });

  it('pings successfully', async () => {
    const llm = new MockLlmProvider();
    await expect(llm.ping()).resolves.toEqual({ ok: true, modelId: 'mock' });
  });
});

describe('DemoService', () => {
  it('returns a mock reply for text input', async () => {
    const demo = createDemoService();
    const result = await demo.chat({ text: 'ping the model' });
    expect(result.reply).toBe('[mock] Echo: ping the model');
    expect(result.modelId).toBe('mock');
  });

  it('includes prior history in the mock echo', async () => {
    const demo = createDemoService();
    const result = await demo.chat({
      text: 'second turn',
      history: [{ role: 'user', content: 'first' }, { role: 'assistant', content: 'reply' }],
    });
    expect(result.reply).toBe('[mock] Echo: second turn');
  });
});
