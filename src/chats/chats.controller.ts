import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { UpdateChatDto } from './dtos/update-chat.dto';

@Controller('chats')
export class ChatsController {
  userID = 'b49e0639-31a0-4a79-82a6-ba961ab90b57';
  constructor(private readonly chatsService: ChatsService) {}

  //hard-coded user's id for the sake of testing stuff out
  @Get()
  getAll() {
    return this.chatsService.fetch(this.userID);
  }

  @Get(':uuid')
  getOne(@Param('uuid', ParseUUIDPipe) chatId: string) {
    return this.chatsService.fetchOne(chatId);
  }

  @Post()
  create() {
    return this.chatsService.createChat(this.userID);
  }

  @Patch(':uuid')
  update(
    @Body() updateChatDto: UpdateChatDto,
    @Param('uuid', ParseUUIDPipe) chatId: string,
  ) {
    return this.chatsService.update(this.userID, chatId, updateChatDto);
  }
}
