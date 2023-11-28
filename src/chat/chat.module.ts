import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AgendaShema } from './model/agenda.schema';
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: 'Agenda', schema: AgendaShema }]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
