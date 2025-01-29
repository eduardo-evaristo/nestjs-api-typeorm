import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';
import { QuestionsModule } from './questions/questions.module';
import { AuthModule } from './auth/auth.module';
import dbConfig from './config/db.config';
import { CacheModule } from '@nestjs/cache-manager';
import redisConfig from './config/redis.config';

@Module({
  imports: [
    //Loading the .env variables
    ConfigModule.forRoot({ load: [dbConfig, redisConfig], isGlobal: true }),
    TypeOrmModule.forRootAsync(dbConfig.asProvider()),
    CacheModule.registerAsync({ isGlobal: true, useFactory: redisConfig }),
    UsersModule,
    ChatsModule,
    QuestionsModule,
    AuthModule,
  ],
})
export class AppModule {}
