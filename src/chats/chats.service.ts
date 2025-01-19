import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { UsersService } from 'src/users/users.service';
import { UpdateChatDto } from './dtos/update-chat.dto';
import { QuestionsService } from 'src/questions/questions.service';
import { QueryParam } from './constants/queryParam';
import { QuestionDetails } from 'src/questions/constants/questionDetails';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private readonly chatsRepository: Repository<Chat>,
    private readonly usersService: UsersService,
    private readonly questionsService: QuestionsService,
  ) {}

  //For now I'll assume the id is predictable since it'll be in the JWT payload and likely visible in the request conetxt
  async createChat(uuid: string) {
    //Checking if user exists in the first place, to avoid errors later on
    const userExists = await this.usersService.fetchOne(uuid);

    //Creating chat instance
    const chat = this.chatsRepository.create({ user: userExists });

    //Stripping only wanted data out of user while saving it
    const {
      user: { id, displayName },
      ...returnedChat
    } = await this.chatsRepository.save(chat);

    //Reassembling chat object in a way that not much info about the user is revealed
    return { user: { id, displayName }, ...returnedChat };
  }

  //Fetch all chats a user has
  async fetch(uuid: string) {
    //Check user's existence
    const user = await this.usersService.fetchOne(uuid);

    return this.chatsRepository.find({
      where: { user: { id: user.id } },
      select: ['id', 'name', 'summary'],
    });
  }

  async fetchOne(chatId: string) {
    // Retrieving chat from db
    //Should I fetch only yhe chat per id and then use QuestionsService to find all questions per Chat to use skip/take?
    const chat = await this.chatsRepository.findOne({
      where: { id: chatId },
      select: ['id', 'name', 'summary'],
      // relations: { questions: { alternatives: true } },
    });

    // If chat is not found
    if (!chat) throw new HttpException('Chat not found', HttpStatus.NOT_FOUND);

    return chat;
  }

  async fetchChatWithQuestions(chatId: string, query: QueryParam) {
    // Retrieving chat from db
    //Should I fetch only yhe chat per id and then use QuestionsService to find all questions per Chat to use skip/take? - solved
    const chat = await this.fetchOne(chatId);

    const questions = await this.questionsService.fetchByChat(chat, query);

    return { chat, questions };
  }

  async update(userId: string, chatId: string, updateDetails: UpdateChatDto) {
    // Checking user's esixtence
    const user = await this.usersService.fetchOne(userId);

    const updatedData = await this.chatsRepository.update(
      { id: chatId },
      updateDetails,
    );

    //If no updates were made
    if (updatedData.affected === 0)
      throw new HttpException('No changes were made', HttpStatus.BAD_REQUEST);

    return this.fetchOne(chatId);
  }

  createQuestion(chatId: string, questionDetails: QuestionDetails) {
    return this.questionsService.createQuestion(chatId, questionDetails);
  }
}
