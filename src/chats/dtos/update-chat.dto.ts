import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateChatDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
