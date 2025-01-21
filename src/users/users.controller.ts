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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ValidatePassword } from './pipes/validate-password.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidateLength } from './pipes/validate-length.pipe';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtGuard)
  getAll() {
    return this.usersService.fetch();
  }

  @Get(':uuid')
  getOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.fetchOne(uuid);
  }

  @Post()
  create(@Body(ValidateLength, ValidatePassword) createUserDto: CreateUserDto) {
    //Creating copy of body (post-validation)
    const { confirmPassword, ...userData } = createUserDto;

    //Calling our service layer and returning whatever it returns
    return this.usersService.createUser(userData);
  }

  @Patch(':uuid')
  edit(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body(ValidateLength, ValidatePassword) updateUserDto: UpdateUserDto,
  ) {
    const { confirmPassword, ...userData } = updateUserDto;
    return this.usersService.updateUser(uuid, userData);
  }

  @Delete(':uuid')
  delete(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.deleteUser(uuid);
  }
}
