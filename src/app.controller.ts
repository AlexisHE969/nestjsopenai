import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<any> {
    try {
      console.log('Hola mundo');
    } catch (error) {
      console.log(error);
    }
  }
}
