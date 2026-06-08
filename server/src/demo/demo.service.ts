import {
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { LlmProvider } from '../llm/llm.provider';
import { LLM_PROVIDER } from '../llm/llm.provider';
import type { ChatMessage } from '../llm/llm.types';

const DEFAULT_SYSTEM_PROMPT =
  'You are a helpful assistant for EtherNetic development testing. Keep replies concise.';

export type DemoChatBody = {
  messages?: ChatMessage[];
  text?: string;
  history?: ChatMessage[];
};

@Injectable()
export class DemoService {
  constructor(
    @Inject(LLM_PROVIDER) private readonly llm: LlmProvider,
    private readonly config: ConfigService,
  ) {}

  async ping(): Promise<{ ok: boolean; modelId: string; latencyMs: number }> {
    const started = Date.now();
    const result = await this.llm.ping();
    return {
      ...result,
      latencyMs: Date.now() - started,
    };
  }

  async chat(body: DemoChatBody): Promise<{
    reply: string;
    modelId: string;
    usage?: { inputTokens?: number; outputTokens?: number };
  }> {
    const messages = this.resolveMessages(body);
    const withSystem = messages.some((m) => m.role === 'system')
      ? messages
      : [{ role: 'system' as const, content: DEFAULT_SYSTEM_PROMPT }, ...messages];

    const maxTokens = Number(this.config.get('DEMO_LLM_MAX_TOKENS', '512'));
    const response = await this.llm.chat({
      messages: withSystem,
      maxTokens,
    });

    return {
      reply: response.content,
      modelId: response.modelId,
      usage: response.usage,
    };
  }

  private resolveMessages(body: DemoChatBody): ChatMessage[] {
    if (body.messages?.length) {
      return body.messages;
    }

    const text = body.text?.trim();
    if (!text) {
      throw new BadRequestException('Provide "text" or "messages"');
    }

    const history = (body.history ?? []).filter(
      (m) => m.role === 'user' || m.role === 'assistant',
    );
    return [...history, { role: 'user', content: text }];
  }
}
