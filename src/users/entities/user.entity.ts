import { Chat } from 'src/chats/entities/chat.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

//This is the representation of the table in the database
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 72, nullable: true })
  password: string;

  @Column({ length: 16 })
  displayName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  authStrategy: string;

  @OneToMany(() => Chat, (chat) => chat.user)
  chats: Chat[];
}
