import { GenerativeModel } from '@google/generative-ai';
import { Inject, Injectable } from '@nestjs/common';
import { GeminiAI } from './ai.provider';

@Injectable()
export class AIService {
  constructor(private readonly geminiAi: GeminiAI) {}
  async answerQuestion(prompt) {
    return this.geminiAi.answer(prompt);
  }
}
