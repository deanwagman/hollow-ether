import { Module } from '@nestjs/common';
import { LlmModule } from '../llm/llm.module';
import { NarrativeService } from './narrative.service';

@Module({
  imports: [LlmModule],
  providers: [NarrativeService],
  exports: [NarrativeService],
})
export class NarrativeModule {}
