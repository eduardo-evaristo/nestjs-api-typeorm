import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Request as ExpressRequest } from 'express';
import { LocalGuard } from './guards/local.guard';
import { RequestUser } from './constants/requestUser';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  singUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Request() req: ExpressRequest) {
    return this.authService.login(req.user as RequestUser);
  }
}
