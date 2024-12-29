import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private readonly chatsRepository: Repository<Chat>,
    private readonly usersService: UsersService,
  ) {}

  //For now I'll assume the id is predictable since it'll be in the JWT payload
  async createChat(uuid: string) {
    const user = await this.usersService.fetchOne(uuid);
    const chat = this.chatsRepository.create({ user });
    return this.chatsRepository.save(chat);
  }

  async fetch(uuid: string) {
    const user = await this.usersService.fetchOne(uuid);
    return this.chatsRepository.find();
  }
}
