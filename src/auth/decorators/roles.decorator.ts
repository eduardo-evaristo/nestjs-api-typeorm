import { SetMetadata } from '@nestjs/common';
import { Role } from '../../users/enums/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: [Role, ...Role[]]) =>
  SetMetadata(ROLES_KEY, roles);

//Strongly typed decorators, created with Reflector.createDecorator, not using this one tho cuz I wanna use rest operator
//export const Roles = Reflector.createDecorator<...roles: Role[]>();
