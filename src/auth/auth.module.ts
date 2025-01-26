import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWTStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import jwtModuleConfig from './config/jwtModule.config';
import { ConfigModule } from '@nestjs/config';
import refreshJwtConfig from './config/refreshJwt.config';
import { RefreshJWTStrategy } from './strategies/refresh-jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync(jwtModuleConfig.asProvider()),
    ConfigModule.forFeature(jwtModuleConfig),
    ConfigModule.forFeature(refreshJwtConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JWTStrategy,
    RefreshJWTStrategy,
    GoogleStrategy,
  ],
})
export class AuthModule {}
