import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthenticatedRequest } from 'src/auth/constants/authenticatedRequest';
import { UsersService } from '../../users/users.service';
import { Role } from '../../users/enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //Get needed roles, at handler level if present and if not, and controller level
    //Reflector allows us to get metadata associated with a handler/class etc
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Get user id
    const user = context.switchToHttp().getRequest<AuthenticatedRequest>().user;

    //TODO: Dynamically check user's role based on his id inside sub inside JwtGuard
    //TODO (inside JwtGuard): Look user up to get his most up to date role
    //const user = await this.usersService.fetchOne(userId);

    // Return boolean for whether 'some'/any of needed roles match user's role or not
    return requiredRoles.some((role) => user.role === role);
  }
}
