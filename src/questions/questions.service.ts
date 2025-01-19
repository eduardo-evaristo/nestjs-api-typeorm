import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { ChatsService } from 'src/chats/chats.service';
import { Alternative } from './entities/alternative.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { QueryParam } from 'src/chats/constants/queryParam';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Alternative)
    alternativeRepository: Repository<Alternative>,
    @Inject(forwardRef(() => ChatsService))
    private readonly chatsService: ChatsService,
    private dataSource: DataSource,
  ) {}

  async createQuestion(chatId: string, questionDetails: CreateQuestionDto) {
    //Making sure chat exists
    const chat = await this.chatsService.fetchOne(chatId);

    //Creating queryRunner from dataSource to perform transaction
    const queryRunner = this.dataSource.createQueryRunner();

    // {
    //   title: 'Após completar o orçamento de vendas no plano financeiro, o empreendedor pode se concentrar nos custos operacionais, que são formados pelas despesas fixas e variáveis. As primeiras são os gastos recorrentes e devem ser previstos com regularidade, e as segundas são gastos ocasionais que variam conforme o uso ou a produção. A partir disso, leia as alternativas a seguir e escolha aquela que apresenta um exemplo de despesa fixa.',
    //   alternatives: [
    //     { content: 'Aluguel', isCorrect: true },
    //     { content: 'Impostos', isCorrect: false },
    //     { content: 'Materiais', isCorrect: false },
    //     { content: 'Fretes', isCorrect: false },
    //     { content: 'Gastos com novos equipamentos', isCorrect: false }
    //   ]
    // }

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const alternatives: Alternative[] = questionDetails.alternatives.reduce(
        (alternativeArray, alternative) => {
          const currentAlternative = queryRunner.manager.create(
            Alternative,
            alternative,
          );
          alternativeArray.push(currentAlternative);
          return alternativeArray;
        },
        [],
      );

      console.log(alternatives);
      const newQuestion = queryRunner.manager.create(Question, {
        ...questionDetails,
        chat,
        alternatives,
      });
      await queryRunner.manager.save(newQuestion);
      await queryRunner.commitTransaction();
      return newQuestion;
    } catch (err: unknown) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        err instanceof Error ? err.message : 'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  fetchByChat(chat: Chat, query: QueryParam) {
    if (Object.keys(query).length > 0) {
      return this.questionRepository.find({
        where: { chat },
        relations: { alternatives: true },
        skip: query.page - 1,
        take: query.results || 5,
      });
    }

    return this.questionRepository.find({
      where: { chat },
      relations: { alternatives: true },
    });
  }
}
