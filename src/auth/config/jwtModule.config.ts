import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
  'jwtModuleConfig',
  (): Pick<JwtModuleOptions, 'secret' | 'signOptions'> => {
    console.log(process.env.JWT_SECRET);
    return {
      secret: process.env.JWT_SECRET,
      //Expiration time for access token is decreased
      signOptions: { expiresIn: '1h' },
    };
  },
);
