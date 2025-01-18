import {
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';

@Controller('questions')
export class QuestionsController {
  @Patch(':uuid')
  update(@Param('uuid', ParseUUIDPipe) questionId: string) {}

  @Delete(':uuid')
  delete(@Param('uuid', ParseUUIDPipe) questionId: string) {}

  //Since creation is entirely tied to being in a Chat, I'll do it under /chats/chatId/questions POST inside chats, the GET one will also be there
}
