import { Controller, Get, Post } from '@nestjs/common';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  //hard-coded user's id for the sake of testing stuff out
  @Get()
  getAll() {
    const uuid = 'b49e0639-31a0-4a79-82a6-ba961ab90b57';
    return this.chatsService.fetch(uuid);
  }

  @Post()
  create() {
    const uuid = 'b49e0639-31a0-4a79-82a6-ba961ab90b57';
    return this.chatsService.createChat(uuid);
  }
}
