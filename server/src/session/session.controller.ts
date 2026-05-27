import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { GameState, SessionPayload } from '@ethernetic/shared';
import { SessionService } from './session.service';

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  create(): Promise<SessionPayload> {
    return this.sessionService.createSession();
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<{ state: GameState }> {
    return this.sessionService.getSession(id).then((state) => ({ state }));
  }

  @Post(':id/interact')
  interact(
    @Param('id') id: string,
    @Body('text') text: string,
  ): Promise<{ state: GameState }> {
    return this.sessionService.interact(id, text ?? '').then((state) => ({ state }));
  }
}
