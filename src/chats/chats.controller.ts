import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { UpdateChatDto } from './dtos/update-chat.dto';
import { CreateQuestionDto } from 'src/questions/dtos/create-question.dto';
import { ValidateQuery } from './pipes/validate-query.pipe';
import { QueryParam } from './constants/queryParam';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AuthenticatedRequest } from 'src/auth/constants/authenticatedRequest';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  @UseGuards(JwtGuard)
  getAll(@Request() req: AuthenticatedRequest) {
    const { sub: uuid } = req.user;
    return this.chatsService.fetch(uuid);
  }

  @Get(':uuid')
  @UseGuards(JwtGuard)
  getOne(@Param('uuid', ParseUUIDPipe) chatId: string) {
    return this.chatsService.fetchOne(chatId);
  }

  @Post()
  @UseGuards(JwtGuard)
  create(@Request() req: AuthenticatedRequest) {
    const { sub: uuid } = req.user;
    return this.chatsService.createChat(uuid);
  }

  @Patch(':uuid')
  update(
    @Body() updateChatDto: UpdateChatDto,
    @Param('uuid', ParseUUIDPipe) chatId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const { sub: userID } = req.user;
    return this.chatsService.update(userID, chatId, updateChatDto);
  }

  @Get(':uuid/questions')
  @UseGuards(JwtGuard)
  fetchChatWithQuestions(
    @Param('uuid', ParseUUIDPipe) chatId: string,
    @Query(ValidateQuery) query: QueryParam,
  ) {
    return this.chatsService.fetchChatWithQuestions(chatId, query);
  }

  @Post(':uuid/questions')
  @UseGuards(JwtGuard)
  createChat(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    return this.chatsService.createQuestion(uuid, createQuestionDto);
  }
}
