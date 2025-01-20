import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    //I guess passreq... is needed cuz in vanilla passport, these values are read straight from the request.body and maybe that's coming from somewhere else here, idk... its deffo needed tho
    super({ usernameField: 'email', passReqToCallback: true });
  }

  async validate(req: Request, email: string, password: string) {
    //For debugging purposes
    console.log(email, password);

    //I'd previously done this inside the verify function, now this responsability is abstracted into the authService
    const user = await this.authService.validateUser(email, password);
    console.log(user);

    //If user isnt found
    if (!user) throw new UnauthorizedException('You do not have access');

    //If all is ok, I guess this attaches it to the request obj (it does)
    return user;
  }
}
