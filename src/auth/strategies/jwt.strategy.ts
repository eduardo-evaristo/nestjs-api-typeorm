import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtModuleConfig from '../config/jwtModule.config';

//Unlike local strat, used to initiate the login validation, which then influences the controller directly thru req.use to generate a token, this one is more of a normal guard, so it does not initiate the auth or anything, it simply acts as a guard in the sense of deciding whether the handler'll be hit or not

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtModuleConfig.KEY)
    private readonly configService: ConfigType<typeof jwtModuleConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.secret,
      ignoreExpiration: false,
    });
  }

  //This validate receives only the decoded token, this fn is only triggered in case our code was successfully decoded, otherwise, it'll throw an 401 Unauthorized and not hit the handler being protected by this guard
  async validate(token) {
    //TODO: Fetch user's most up-to-date role inside here and include it in the token
    console.log(token);
    return token;
  }
}
