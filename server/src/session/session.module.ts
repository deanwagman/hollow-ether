import { Module } from '@nestjs/common';
import { NarrativeModule } from '../narrative/narrative.module';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { SessionStore } from './session.store';

@Module({
  imports: [NarrativeModule],
  controllers: [SessionController],
  providers: [SessionService, SessionStore],
})
export class SessionModule {}
