import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { OAuthCreateUserParams } from 'src/users/constants/OAuthCreateUserParams';
import { AuthService } from '../auth.service';
import { RequestUser } from '../constants/requestUser';
import { UsersService } from 'src/users/users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {
    super({
      clientID: process.env.GOOGLE_OAUTH2_CLIENTID,
      clientSecret: process.env.GOOGLE_OAUTH2_CLIENTSECRET,
      callbackURL: 'http://localhost:3000/auth/google/post',
      scope: ['profile', 'email'],
    });
  }
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile,
  ): Promise<RequestUser> {
    //Getting user data
    console.log(profile);
    const displayName: string = profile.name.givenName;
    const email: string = profile.emails[0].value;
    console.log(displayName, email);

    //Validating whether user exists
    const user: RequestUser | null =
      await this.authService.validateGoogleUser(email);

    //If it does not exist, we create it and return the newly created user
    if (!user) {
      //OAuth does not need a password
      const toBeCreatedUser: OAuthCreateUserParams = {
        displayName,
        email,
        authStrategy: 'google',
      };
      return this.userService.createGoogleUser(toBeCreatedUser);
    }

    //If user exists, we return it, to be included inside req.user
    return user;
  }
}
