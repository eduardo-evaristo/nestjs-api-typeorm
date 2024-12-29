import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatsService } from './chats.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), UsersModule],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
