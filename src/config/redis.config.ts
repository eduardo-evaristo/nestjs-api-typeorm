import KeyvRedis from '@keyv/redis';
import { CacheModuleOptions } from '@nestjs/cache-manager';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'redisConfig',
  (): CacheModuleOptions => ({
    stores: [new KeyvRedis({ url: process.env.REDIS_URL })],
  }),
);
