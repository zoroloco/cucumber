import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global() //a global module will ensure redisservice has only 1 instance throughout app
@Module({ providers: [RedisService], exports: [RedisService] })
export class CacheModule {}
