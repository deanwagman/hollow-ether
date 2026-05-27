import { Injectable } from '@nestjs/common';
import type { GameState } from '@ethernetic/shared';

@Injectable()
export class SessionStore {
  private readonly sessions = new Map<string, GameState>();

  create(id: string, state: GameState): void {
    this.sessions.set(id, state);
  }

  get(id: string): GameState | undefined {
    return this.sessions.get(id);
  }

  set(id: string, state: GameState): void {
    this.sessions.set(id, state);
  }

  has(id: string): boolean {
    return this.sessions.has(id);
  }
}
