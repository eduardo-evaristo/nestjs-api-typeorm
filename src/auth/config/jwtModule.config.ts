import { registerAs } from '@nestjs/config';

export default registerAs('jwtModuleConfig', () => {
  console.log(process.env.JWT_SECRET);
  return {
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '10h' },
  };
});
