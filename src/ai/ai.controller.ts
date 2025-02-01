import { Controller, Param, Post, Query } from '@nestjs/common';
import { AIService } from './ai.service';

//Solely for debugging AI behavior
@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}
  @Post()
  test(@Query('q') question: string) {
    return this.aiService.answerQuestion(question);
  }
}
