import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  buildContext,
  getSpiritLines,
  type GameState,
} from '@hollow-ether/shared';
import type { LlmProvider } from '../llm/llm.provider';
import { LLM_PROVIDER } from '../llm/llm.provider';
import type { ChatMessage } from '../llm/llm.types';
import {
  buildLuminiaSystemPrompt,
  buildNarrativeHistory,
  parseSpiritLines,
} from './narrative.prompt';

@Injectable()
export class NarrativeService {
  private readonly logger = new Logger(NarrativeService.name);

  constructor(@Inject(LLM_PROVIDER) private readonly llm: LlmProvider) {}

  async generateSpiritLines(
    state: GameState,
    playerText: string,
  ): Promise<string[]> {
    try {
      const system = buildLuminiaSystemPrompt(state.currentScene, state.flags);
      const openingLine =
        state.messages[0]?.speaker === 'luminia' ? state.messages[0].text : undefined;
      const lastLuminiaLine = [...state.messages]
        .reverse()
        .find((message) => message.speaker === 'luminia')?.text;
      let systemWithContext = system;
      if (openingLine) {
        systemWithContext += `\n\nYou already opened the scene with: "${openingLine}"`;
      }
      if (lastLuminiaLine) {
        systemWithContext += `\n\nYour last reply was: "${lastLuminiaLine}" — do not repeat it.`;
      }
      const history = buildNarrativeHistory(state);
      const messages: ChatMessage[] = [
        { role: 'system', content: systemWithContext },
        ...history,
        { role: 'user', content: playerText },
      ];

      const response = await this.llm.chat({ messages });
      const lines = parseSpiritLines(response.content);
      if (lines.length > 0) {
        return lines;
      }
    } catch (error) {
      this.logger.warn(
        `LLM narrative failed, falling back to mock lines: ${error instanceof Error ? error.message : error}`,
      );
    }

    const ctx = buildContext(playerText);
    return getSpiritLines(state.currentScene, playerText, ctx);
  }
}
