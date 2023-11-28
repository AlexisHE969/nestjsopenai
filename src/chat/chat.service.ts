import { Injectable } from '@nestjs/common';
//import axios from 'axios';
//import npl from 'compromise';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Agenda } from './model/agenda';
import OpenAI from 'openai';

@Injectable()
export class ChatService {
  private openai: OpenAI;
  constructor(
    private readonly configService: ConfigService,
    @InjectModel('Agenda') private readonly agendaModel: Model<Agenda>,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY_ALEX'),
    });
  }

  async crateAssistant(): Promise<any> {
    try {
      const assistant = await this.openai.beta.assistants.create({
        name: 'Hortencia Tutor',
        instructions: 'You are a personal asistant',
        tools: [{ type: 'code_interpreter' }],
        model: 'gpt-3.5-turbo',
      });
      console.log('This is the assistant object: ', assistant, '\n');

      const thread = await this.openai.beta.threads.create();

      return { assistant: assistant.id, thread: thread.id };
    } catch (error) {
      console.log(error);
    }
  }
  async getChatResponse(data: any): Promise<any> {
    try {
      const response = [];

      const threadsmessages = await this.openai.beta.threads.messages.create(
        data.thread,
        {
          role: 'user',
          content: data.message,
        },
      );

      const run = await this.openai.beta.threads.runs.create(data.thread, {
        assistant_id: data.assistant,
      });

      let keepRetrievingRun;

      while (run.status !== 'completed') {
        keepRetrievingRun = await this.openai.beta.threads.runs.retrieve(
          data.thread,
          run.id,
        );

        if (keepRetrievingRun.status === 'completed') {
          console.log('Complete');
          const allMessages = await this.openai.beta.threads.messages.list(
            data.thread,
          );

          const extractedData = this.extractCitaDataFromMessage(
            allMessages.data[0].content[0]['text'].value,
          );
          await this.saveCitaData(extractedData);
          response.push({
            message: allMessages.data[0].content[0]['text'],
            user: threadsmessages.content,
            extractedData: extractedData,
          });
          break;
        }

        if (keepRetrievingRun.status === 'failed') {
          break;
        }
      }

      return response;
    } catch (error) {
      console.error('Error en la solicitud a la API de OpenAI:', error);
      throw new Error('Error al procesar la solicitud a OpenAI');
    }
  }

  private extractCitaDataFromMessage(analyzedMessage: string): any {
    const mensajeCompleto = analyzedMessage;

    // Expresiones regulares para extraer información específica del mensaje
    const nombreRegex = /agendado una cita para (\w+\s\w+)/i;
    const telefonoRegex = /Número de teléfono: (\d+)|teléfono  (\d+)/;
    const emailRegex = /Correo electrónico: (\S+)|Email: (\S+)/;
    const fechaRegex = /Fecha: (\d{2}\/\d{2}\/\d{4}) |el (\d{2}\/\d{2}\/\d{4})/;
    const horaRegex =
      /Hora: (\d{1,2}:\d{2} (AM|PM))|a las \d{1,2}:\d{2} (AM|PM)/;

    const nombreMatch = mensajeCompleto.match(nombreRegex);
    const telefonoMatch = mensajeCompleto.match(telefonoRegex);
    const emailMatch = mensajeCompleto.match(emailRegex);
    const fechaMatch = mensajeCompleto.match(fechaRegex);
    const horaMatch = mensajeCompleto.match(horaRegex);

    const nombre = nombreMatch ? nombreMatch[1] : null;
    const telefono = telefonoMatch ? telefonoMatch[1] : null;
    const email = emailMatch ? emailMatch[1] : null;
    const fecha = fechaMatch ? fechaMatch[1] : null;
    const hora = horaMatch ? horaMatch[1] : null;

    return { nombre, telefono, email, fecha, hora, mensajeCompleto };
  }

  private async saveCitaData(data: any): Promise<void> {
    const nuevaCita = new this.agendaModel(data);
    await nuevaCita.save();
  }
}
