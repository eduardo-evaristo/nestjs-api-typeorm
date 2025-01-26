import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Chat } from 'src/chats/entities/chat.entity';
import { Alternative } from 'src/questions/entities/alternative.entity';
import { Question } from 'src/questions/entities/question.entity';
import { User } from 'src/users/entities/user.entity';

export default registerAs(
  'databaseConfig',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.HOST,
    database: process.env.DATABASE,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    port: Number(process.env.DATABASE_PORT),
    entities: [User, Chat, Question, Alternative],
    synchronize: true,
    ssl: false,
  }),
);
