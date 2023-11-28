import { Controller, Post, Body, Res, HttpStatus, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageDto } from './dto/message.dto';
@Controller('chat')
export class ChatController {
  constructor(private readonly openaiService: ChatService) {}

  @Get('/create/assistant')
  async createAssitant(@Res() res: any) {
    try {
      const data = await this.openaiService.crateAssistant();
      res.status(HttpStatus.OK).json({
        isValid: true,
        message: 'Assistant created',
        data: data,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        isValid: false,
        message: `Error al consultar chat ${error}`,
      });
    }
  }

  @Post('/message')
  async getChatResponse(@Body() messageDTO: MessageDto, @Res() res: any) {
    try {
      const response = await this.openaiService.getChatResponse(messageDTO);

      res.status(HttpStatus.OK).json({
        isValid: true,
        message: 'Respuesta optenida',
        data: response,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        isValid: false,
        message: `Error al consultar chat ${error}`,
      });
    }
  }
}
