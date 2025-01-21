import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Request as ExpressRequest } from 'express';
import { LocalGuard } from './guards/local.guard';
import { RequestUser } from './constants/requestUser';
import { GoogleGuard } from './guards/google.guard';

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

  @Get('google')
  @UseGuards(GoogleGuard)
  loginWithGoogle(@Request() req: ExpressRequest) {
    console.log('pŕimeiro passo do oauth2');
    return 'sadsad';
  }

  @Get('google/post')
  //OAuth2 needs two get routes, the first one is merely to hit the authentication, it will not even be executed (handler), we need to send it to a second route which is where we actually get our req.user populated and finally send a response
  //Both the initializer route and final route need to be decorated with the same guard!
  @UseGuards(GoogleGuard)
  loginWithGooglePost(@Request() req: ExpressRequest) {
    return this.authService.login(req.user as RequestUser);
  }
}
