import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  applyInteractWithSpiritLines,
  buildContext,
  buildInteractMeta,
  createInitialSession,
  getSpiritLines,
  resolveInteractRules,
  type GameState,
  type SessionPayload,
} from '@hollow-ether/shared';
import { randomUUID } from 'crypto';
import { NarrativeService } from '../narrative/narrative.service';
import { SessionStore } from './session.store';

@Injectable()
export class SessionService {
  constructor(
    private readonly store: SessionStore,
    private readonly narrative: NarrativeService,
    private readonly config: ConfigService,
  ) {}

  async createSession(): Promise<SessionPayload> {
    const sessionId = randomUUID();
    const state = createInitialSession();
    await this.store.create(sessionId, state);
    return { sessionId, state };
  }

  async getSession(sessionId: string): Promise<GameState> {
    const state = await this.store.get(sessionId);
    if (!state) {
      throw new NotFoundException('Session not found');
    }
    return state;
  }

  async interact(sessionId: string, text: string): Promise<GameState> {
    const state = await this.store.get(sessionId);
    if (!state) {
      throw new NotFoundException('Session not found');
    }

    const trimmed = text.trim();
    if (!trimmed) {
      throw new BadRequestException('Message text is required');
    }

    const next = await this.applyPlayerInteract(state, trimmed);
    if (next === null) {
      return state;
    }

    await this.store.set(sessionId, next);
    return next;
  }

  async applyPlayerInteract(
    state: GameState,
    trimmed: string,
  ): Promise<GameState | null> {
    const { meta, awakeningOrientationSeen } = buildInteractMeta(state, trimmed);
    const rules = resolveInteractRules(state.currentScene, trimmed, state.flags, {
      ...meta,
      awakeningOrientationSeen,
    });

    let spiritLines: string[];
    if (rules.replaceSpiritLines) {
      spiritLines = rules.replaceSpiritLines;
    } else if (this.config.get<string>('NARRATIVE_PROVIDER') === 'llm') {
      spiritLines = await this.narrative.generateSpiritLines(state, trimmed);
    } else {
      const ctx = buildContext(trimmed);
      spiritLines = getSpiritLines(state.currentScene, trimmed, ctx);
    }

    return applyInteractWithSpiritLines(state, trimmed, spiritLines, rules);
  }
}
