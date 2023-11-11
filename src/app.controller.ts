import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { OpenAI } from 'openai';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<any> {
    try {
      const openAI = new OpenAI({
        apiKey: 'your-api-key',
      });
      const completion = await openAI.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a poetic assistant, skilled in explaining complex programming concepts with creative flair.',
          },
          {
            role: 'user',
            content:
              'Compose a poem that explains the concept of recursion in programming.',
          },
        ],
      });

      console.log(completion.choices[0].message);
    } catch (error) {
      console.log(error);
    }
  }
}
