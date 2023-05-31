import { Injectable, Logger } from '@nestjs/common';
import * as Redis from 'ioredis';

/**
 * Provides access to the redisClient
 *
 */
@Injectable()
export class RedisService {
  public readonly redisClient: Redis.Redis;

  private redisPort: number = parseInt(process.env.REDIS_PORT) || 6379;

  constructor() {
    this.redisClient = new Redis.Redis({
      host: process.env.REDIS_HOST,
      port: this.redisPort,
    });

    Logger.log(
      'Redis Client initialized on host:' +
        process.env.REDIS_HOST +
        ' and port:' +
        this.redisPort,
    );
  }
}
