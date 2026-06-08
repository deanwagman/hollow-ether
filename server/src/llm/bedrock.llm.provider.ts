import {
  BedrockRuntimeClient,
  ConverseCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { LlmProvider } from './llm.provider';
import type { ChatMessage, ChatRequest, ChatResponse, LlmPingResult } from './llm.types';

@Injectable()
export class BedrockLlmProvider implements LlmProvider {
  private readonly client: BedrockRuntimeClient;
  private readonly modelId: string;
  private readonly defaultMaxTokens: number;

  constructor(private readonly config: ConfigService) {
    const region = this.config.get<string>('AWS_REGION', 'us-east-1');
    this.modelId = this.config.get<string>(
      'BEDROCK_MODEL_ID',
      'us.amazon.nova-lite-v1:0',
    );
    this.defaultMaxTokens = Number(this.config.get('DEMO_LLM_MAX_TOKENS', '512'));
    this.client = new BedrockRuntimeClient({ region });
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const system = request.messages.find((m) => m.role === 'system')?.content;
    const converseMessages = request.messages
      .filter((m) => m.role !== 'system')
      .map((m) => this.toConverseMessage(m));

    const output = await this.client.send(
      new ConverseCommand({
        modelId: this.modelId,
        system: system ? [{ text: system }] : undefined,
        messages: converseMessages,
        inferenceConfig: {
          maxTokens: request.maxTokens ?? this.defaultMaxTokens,
          temperature: request.temperature ?? 0.7,
        },
      }),
    );

    const text =
      output.output?.message?.content?.find((block) => 'text' in block)?.text ?? '';

    return {
      content: text,
      modelId: this.modelId,
      usage: {
        inputTokens: output.usage?.inputTokens,
        outputTokens: output.usage?.outputTokens,
      },
    };
  }

  async ping(): Promise<LlmPingResult> {
    const response = await this.chat({
      messages: [{ role: 'user', content: 'Reply with exactly: OK' }],
      maxTokens: 16,
      temperature: 0,
    });
    return {
      ok: response.content.trim().length > 0,
      modelId: this.modelId,
    };
  }

  private toConverseMessage(message: ChatMessage) {
    return {
      role: message.role === 'assistant' ? ('assistant' as const) : ('user' as const),
      content: [{ text: message.content }],
    };
  }
}
