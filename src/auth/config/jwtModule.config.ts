import { registerAs } from '@nestjs/config';

export default registerAs('jwtModuleConfig', () => {
  console.log(process.env.JWT_SECRET);
  return {
    secret: process.env.JWT_SECRET,
    //Expiration time for access token is decreased
    signOptions: { expiresIn: '15s' },
  };
});
