import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';
import { QuestionsModule } from './questions/questions.module';
import { AuthModule } from './auth/auth.module';
import dbConfig from './config/db.config';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    //Loading the .env variables
    ConfigModule.forRoot({ load: [dbConfig], isGlobal: true }),
    TypeOrmModule.forRootAsync(dbConfig.asProvider()),
    CacheModule.register({ isGlobal: true }),
    UsersModule,
    ChatsModule,
    QuestionsModule,
    AuthModule,
  ],
})
export class AppModule {}
