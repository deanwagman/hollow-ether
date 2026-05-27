import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { SessionStore } from './session.store';

@Module({
  controllers: [SessionController],
  providers: [SessionService, SessionStore],
})
export class SessionModule {}
