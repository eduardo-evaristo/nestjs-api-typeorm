import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { ChatsModule } from './chats/chats.module';
import { Chat } from './chats/entities/chat.entity';

@Module({
  imports: [
    //Loading the .env variables
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      database: process.env.DATABASE,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      port: Number(process.env.DATABASE_PORT),
      entities: [User, Chat],
      synchronize: true,
      ssl: false,
    }),
    UsersModule,
    ChatsModule,
  ],
})
export class AppModule {}
