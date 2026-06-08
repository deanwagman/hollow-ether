import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BedrockLlmProvider } from './bedrock.llm.provider';
import { LLM_PROVIDER } from './llm.provider';
import { MockLlmProvider } from './mock.llm.provider';

@Module({
  providers: [
    BedrockLlmProvider,
    {
      provide: LLM_PROVIDER,
      useFactory: (config: ConfigService, bedrock: BedrockLlmProvider) => {
        const provider = config.get<string>('LLM_PROVIDER', 'bedrock');
        if (provider === 'mock') {
          return new MockLlmProvider();
        }
        return bedrock;
      },
      inject: [ConfigService, BedrockLlmProvider],
    },
  ],
  exports: [LLM_PROVIDER],
})
export class LlmModule {}
