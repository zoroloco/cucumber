import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { UserRoleRef,UserRoleRefEndpoint } from '../entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppCacheController } from './app-cache.controller';

@Global() //a global module will ensure redisservice has only 1 instance throughout app
@Module({
  imports: [CacheModule, TypeOrmModule.forFeature([UserRoleRef,UserRoleRefEndpoint], 'druidia')],
  controllers: [AppCacheController],
  providers: [RedisService],
  exports: [RedisService],
})
export class CacheModule {}
