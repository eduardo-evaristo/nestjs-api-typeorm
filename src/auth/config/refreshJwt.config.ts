import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export default registerAs(
  'refreshTokenConfig',
  (): JwtSignOptions => ({
    expiresIn: '7d',
    secret: process.env.REFRESH_JWT_SECRET,
  }),
);
