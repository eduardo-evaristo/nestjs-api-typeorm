import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/constants/env';

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
// export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

@Injectable()
export class GeminiAI {
  private model: GenerativeModel;
  constructor(private configService: ConfigService<EnvironmentVariables>) {
    //Initializing the model
    this.model = new GoogleGenerativeAI(
      this.configService.get('GEMINI_API_KEY'),
    ).getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async answer(prompt: string) {
    const result = await this.model.generateContent(
      `${this.configService.get('INSTRUCTION')}. ${prompt}`,
    );
    const formattedResult = result.response
      .text()
      .replaceAll('`', '')
      .replace('json', '');

    return JSON.parse(formattedResult);
  }
}
