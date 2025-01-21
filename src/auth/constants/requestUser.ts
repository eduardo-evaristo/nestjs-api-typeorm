import { User } from 'src/users/entities/user.entity';

export type RequestUser = Omit<User, 'password' | 'chats'>;
