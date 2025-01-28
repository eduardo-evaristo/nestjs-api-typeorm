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
  Response,
  Inject,
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
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/constants/env';

@Controller('users')
@Roles(Role.USER, Role.ADMIN)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private configService: ConfigService<EnvironmentVariables>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

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
  async deleteOwnAccount(
    @Request() req: AuthenticatedRequest,
    @Response() res: ExpressResponse,
  ) {
    //Getting latest acess token and refresh token out of request
    const acessToken = req.headers['authorization'].split(' ')[1];
    const refreshToken = req.cookies.refreshToken;

    //Attemping to delete user
    await this.usersService.deleteUser(req.user.sub);

    //If successful, clearing cookie and removing it from the whitelist
    res.clearCookie('refreshToken');
    await this.cacheManager.del(refreshToken);

    //Settign latest access token in blacklist
    await this.cacheManager.set(
      acessToken,
      1,
      this.configService.get('ACCESS_TOKEN_BLACKLIST_TTL'),
    );

    //Sending out response
    res.sendStatus(200);
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
