import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService {
  public readonly redisClient: Redis.Redis;

  private redisPort: number = parseInt(process.env.REDIS_PORT) || 6379;

  constructor() {
    this.redisClient = new Redis.Redis({
      host: process.env.REDIS_HOST,
      port: this.redisPort,
    });
  }
}
