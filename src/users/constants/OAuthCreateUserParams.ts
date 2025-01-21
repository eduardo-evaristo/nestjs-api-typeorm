import { CreateUserParams } from './createUserParams';

export type OAuthCreateUserParams = Omit<CreateUserParams, 'password'> & {
  authStrategy: string;
};
