import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import refreshJwtConfig from '../config/refreshJwt.config';
import { extractJwtFromCookie } from '../utils/helpers';

//Unlike local strat, used to initiate the login validation, which then influences the controller directly thru req.use to generate a token, this one is more of a normal guard, so it does not initiate the auth or anything, it simply acts as a guard in the sense of deciding whether the handler'll be hit or not

@Injectable()
export class RefreshJWTStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    @Inject(refreshJwtConfig.KEY)
    private readonly configService: ConfigType<typeof refreshJwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractJwtFromCookie]),
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
