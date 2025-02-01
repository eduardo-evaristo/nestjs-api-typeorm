import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { GeminiAI } from './ai.provider';
import { AIController } from './ai.controller';

@Module({
  controllers: [AIController],
  providers: [AIService, { provide: GeminiAI, useClass: GeminiAI }],
  exports: [AIService],
})
export class AiModule {}
