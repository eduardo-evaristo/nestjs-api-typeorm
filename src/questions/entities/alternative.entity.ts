import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity({ name: 'alternatives' })
export class Alternative {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column()
  isCorrect: boolean;

  @ManyToOne(() => Question, (question) => question.alternatives)
  question: Question;
}
