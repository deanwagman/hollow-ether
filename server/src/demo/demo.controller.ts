import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { DemoEnabledGuard } from './demo-enabled.guard';
import { DemoService, type DemoChatBody } from './demo.service';

@Controller('demo')
@UseGuards(DemoEnabledGuard)
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Get('llm-ping')
  ping() {
    return this.demoService.ping();
  }

  @Post('chat')
  chat(@Body() body: DemoChatBody) {
    return this.demoService.chat(body);
  }
}
