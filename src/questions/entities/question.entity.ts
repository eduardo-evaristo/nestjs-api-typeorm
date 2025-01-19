import { Chat } from 'src/chats/entities/chat.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Alternative } from './alternative.entity';

@Entity({ name: 'questions' })
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => Chat, (chat) => chat.questions)
  chat: Chat;

  @OneToMany(() => Alternative, (alternative) => alternative.question, {
    cascade: ['insert'],
  })
  alternatives: Alternative[];
}
