import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ValidatePassword } from './pipes/validate-password.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidateLength } from './pipes/validate-length.pipe';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AuthenticatedRequest } from 'src/auth/constants/authenticatedRequest';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './enums/roles.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('users')
@Roles(Role.USER, Role.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  getOne(@Request() req: AuthenticatedRequest) {
    const { sub: uuid } = req.user;
    return this.usersService.fetchOne(uuid);
  }

  @Patch()
  @UseGuards(JwtGuard)
  edit(
    @Request() req: AuthenticatedRequest,
    @Body(ValidateLength, ValidatePassword) updateUserDto: UpdateUserDto,
  ) {
    //Stripping user uuid out of authenticated request
    const { sub: uuid } = req.user;

    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...userData } = updateUserDto;

    return this.usersService.updateUser(uuid, userData);
  }

  @Delete()
  @UseGuards(JwtGuard)
  deleteOwnAccount(@Request() req: AuthenticatedRequest) {
    return this.usersService.deleteUser(req.user.sub);
  }

  @Get('all')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getAll() {
    return this.usersService.fetch();
  }

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body(ValidateLength, ValidatePassword) createUserDto: CreateUserDto) {
    //Creating copy of body (post-validation)
    const { confirmPassword, ...userData } = createUserDto;

    //Calling our service layer and returning whatever it returns
    return this.usersService.createUser(userData);
  }
}
