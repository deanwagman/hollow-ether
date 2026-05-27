import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  applyInteract,
  createInitialSession,
  type GameState,
  type SessionPayload,
} from '@ethernetic/shared';
import { randomUUID } from 'crypto';
import { SessionStore } from './session.store';

@Injectable()
export class SessionService {
  constructor(private readonly store: SessionStore) {}

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

    const next = applyInteract(state, trimmed);
    if (next === null) {
      return state;
    }

    await this.store.set(sessionId, next);
    return next;
  }
}
