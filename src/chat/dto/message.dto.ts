// message.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class MessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  assistant: string;

  @IsString()
  @IsNotEmpty()
  thread: string;

  @IsString()
  @IsNotEmpty()
  user_id: string;
}
