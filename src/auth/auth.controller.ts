import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { LocalGuard } from './guards/local.guard';
import { RequestUser } from './constants/requestUser';
import { GoogleGuard } from './guards/google.guard';
import { RefreshGuard } from './guards/refresh-jwt.guard';
import { AuthenticatedRequest } from './constants/authenticatedRequest';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  singUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  @UseGuards(LocalGuard)
  async login(
    @Request() req: ExpressRequest,
    @Response() res: ExpressResponse,
  ) {
    const { refreshToken, accessToken } = await this.authService.login(
      req.user as RequestUser,
    );

    //TODO: Add security to cookie storage
    res.cookie('refreshToken', refreshToken);

    //Sending responses the express way because we need to set a cookie
    res.status(200).json({ refreshToken, accessToken });
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  loginWithGoogle() {}

  @Get('google/post')
  //OAuth2 needs two get routes, the first one is merely to hit the authentication, it will not even be executed (handler), we need to send it to a second route which is where we actually get our req.user populated and finally send a response
  //Both the initializer route and final route need to be decorated with the same guard!
  @UseGuards(GoogleGuard)
  loginWithGooglePost(@Request() req: ExpressRequest) {
    return this.authService.login(req.user as RequestUser);
  }

  //Whenever acesstoken is expired, the client must try and hit this route, if their refresh token is not expired and is valid, they will be issued a n-ew access token with the payload contained in the refreshToken, which is the same as the one in acessToken
  @Post('refresh')
  @UseGuards(RefreshGuard)
  refreshToken(@Request() req: AuthenticatedRequest) {
    const payloadFromRefresh = { sub: req.user.sub, role: req.user.role };
    return this.authService.refreshToken(payloadFromRefresh);
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  //Fix typing later, sum is wrong with AuthenticatedRequest when using req.headers
  async logout(
    @Request() req: ExpressRequest,
    @Response() res: ExpressResponse,
  ) {
    const accessToken = req.headers.authorization.split(' ')[1];
    const refreshToken = req.cookies.refreshToken;
    const user = req.user;

    //For debbuging purposes
    console.log('logout');
    console.log(accessToken, refreshToken);

    //Assigning response with cookie cleared to res (see method)
    res = await this.authService.logout(accessToken, refreshToken, user, res);

    //Finishing the req-res cycle with the cookie-free response
    res.sendStatus(200);
  }
}
