import { Module } from '@nestjs/common';
import { LlmModule } from '../llm/llm.module';
import { DemoController } from './demo.controller';
import { DemoEnabledGuard } from './demo-enabled.guard';
import { DemoService } from './demo.service';

@Module({
  imports: [LlmModule],
  controllers: [DemoController],
  providers: [DemoService, DemoEnabledGuard],
})
export class DemoModule {}
