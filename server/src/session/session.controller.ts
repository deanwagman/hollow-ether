import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { GameState, SessionPayload } from '@ethernetic/shared';
import { SessionService } from './session.service';

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  create(): SessionPayload {
    return this.sessionService.createSession();
  }

  @Get(':id')
  get(@Param('id') id: string): { state: GameState } {
    return { state: this.sessionService.getSession(id) };
  }

  @Post(':id/interact')
  interact(
    @Param('id') id: string,
    @Body('text') text: string,
  ): { state: GameState } {
    return { state: this.sessionService.interact(id, text ?? '') };
  }
}
