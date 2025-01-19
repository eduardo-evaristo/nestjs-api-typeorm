import { forwardRef, Inject, Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { ChatsModule } from 'src/chats/chats.module';
import { Alternative } from './entities/alternative.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Alternative]),
    //Circular dependency
    forwardRef(() => ChatsModule),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
