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

  createSession(): SessionPayload {
    const sessionId = randomUUID();
    const state = createInitialSession();
    this.store.create(sessionId, state);
    return { sessionId, state };
  }

  getSession(sessionId: string): GameState {
    const state = this.store.get(sessionId);
    if (!state) {
      throw new NotFoundException('Session not found');
    }
    return state;
  }

  interact(sessionId: string, text: string): GameState {
    const state = this.store.get(sessionId);
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

    this.store.set(sessionId, next);
    return next;
  }
}
