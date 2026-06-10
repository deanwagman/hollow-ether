import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { GameState } from '@hollow-ether/shared';
import { PrismaService } from '../prisma/prisma.service';

function normalizeGameState(state: GameState): GameState {
  return {
    ...state,
    invitationTurns: state.invitationTurns ?? 0,
  };
}

@Injectable()
export class SessionStore {
  constructor(private readonly prisma: PrismaService) {}

  async create(id: string, state: GameState): Promise<void> {
    await this.prisma.session.create({
      data: {
        id,
        state: state as unknown as Prisma.InputJsonValue,
      },
    });
  }

  async get(id: string): Promise<GameState | undefined> {
    const row = await this.prisma.session.findUnique({ where: { id } });
    if (!row) return undefined;
    return normalizeGameState(row.state as GameState);
  }

  async set(id: string, state: GameState): Promise<void> {
    await this.prisma.session.update({
      where: { id },
      data: { state: state as unknown as Prisma.InputJsonValue },
    });
  }
}
