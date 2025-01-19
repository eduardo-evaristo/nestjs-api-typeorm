import { IsArray, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  title: string;
  @IsArray()
  alternatives: any[];
}
