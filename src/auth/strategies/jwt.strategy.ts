import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtModuleConfig from '../config/jwtModule.config';
import { Request } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

//Unlike local strat, used to initiate the login validation, which then influences the controller directly thru req.use to generate a token, this one is more of a normal guard, so it does not initiate the auth or anything, it simply acts as a guard in the sense of deciding whether the handler'll be hit or not

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtModuleConfig.KEY)
    private readonly configService: ConfigType<typeof jwtModuleConfig>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.secret,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  //This validate receives only the decoded token, this fn is only triggered in case our code was successfully decoded, otherwise, it'll throw an 401 Unauthorized and not hit the handler being protected by this guard
  async validate(req: Request, token) {
    //TODO: Fetch user's most up-to-date role inside here and include it in the token
    //Fetching to see if accessToken is in cache (blacklisted)
    const accessToken = req.headers.authorization.split(' ')[1];
    const accessTokenIsInCache = await this.cacheManager.get(accessToken);

    //Throwing unauthorized if so
    if (accessTokenIsInCache) throw new UnauthorizedException();

    console.log(token);
    return token;
  }
}
