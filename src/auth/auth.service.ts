import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserParams } from 'src/users/constants/createUserParams';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JWTPayload } from './constants/jwtPayload';
import { User } from 'src/users/entities/user.entity';
import { RequestUser } from './constants/requestUser';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from './config/refreshJwt.config';
import { ConfigType } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private configService: ConfigType<typeof refreshJwtConfig>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    //Check if email is already registered
    const user = await this.usersService.findByEmail(createUserDto.email);

    //If user with said email exists, throw an error
    if (user) throw new BadRequestException('Email is already registered');

    //If not taken, check if provided passwords match
    if (!(createUserDto.password === createUserDto.confirmPassword))
      throw new BadRequestException('Passwords do not match');

    //If passwords match, hash it - extract this into a helper fn
    const password = createUserDto.password;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    //After password has been hashed, create a CreateUserParams obj
    const toBeCreatedUser: CreateUserParams = {
      displayName: createUserDto.displayName,
      email: createUserDto.email,
      password: hashedPassword,
    };

    //Pass it down to createUser
    return this.usersService.createUser(toBeCreatedUser);
  }

  //For use with passport strategy (validation inside verify)
  async validateUser(email: string, pass: string): Promise<RequestUser | null> {
    const user: User = await this.usersService.findByEmail(email);

    //If user is truthy and passwords match
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, chats, ...result } = user;
      return result;
    }

    //Otherwise, return null
    return null;
  }

  async validateGoogleUser(email: string): Promise<RequestUser | null> {
    const user: User = await this.usersService.findByEmail(email);

    //If user exists
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, chats, ...result } = user;
      return result;
    }

    //Otherwise, return null
    return null;
  }

  //TODO: sign payload with token only
  async login(user: RequestUser) {
    //Payload to be signed into JWT and Refresh JWT
    const accessTokenPayload: JWTPayload = { sub: user.id, role: user.role };

    //Generating JWT and returning it to the client (might as well save this as a cookie later on)
    const accessToken = await this.jwtService.signAsync(accessTokenPayload);
    const refreshToken = await this.jwtService.signAsync(accessTokenPayload, {
      secret: this.configService.secret,
      expiresIn: this.configService.expiresIn,
    });

    await this.cacheManager.set(refreshToken, user.id, 120000);

    return { accessToken, refreshToken };
  }

  async refreshToken(payloadFromRefresh: JWTPayload) {
    return { acessToken: await this.jwtService.signAsync(payloadFromRefresh) };
  }
}
