import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as Redis from 'ioredis';
import { Repository } from 'typeorm';
import { AppConstants } from '../app.constants';
import { UserRoleRef, UserRoleRefEndpoint } from '../entities';

/**
 * Provides access to the redisClient
 *
 */
@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  public readonly redisClient: Redis.Redis;

  private redisPort: number = parseInt(process.env.REDIS_PORT) || 6379;

  constructor(
    @InjectRepository(UserRoleRef, 'druidia')
    private readonly userRoleRefRepository: Repository<UserRoleRef>,
    @InjectRepository(UserRoleRefEndpoint, 'druidia')
    private readonly userRoleRefEndpointRepository: Repository<UserRoleRefEndpoint>,
  ) {
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

    this.initCache();
  }

  private initCache() {
    this.logger.log('Initializing Redis cache service.');
    this.initUserRoleRefs();
    this.initUserRoleRefEndpoints();
  }

  private async initUserRoleRefEndpoints() {
    this.logger.log('Adding user role ref endpoints to redis cache.');
    let userRoleRefEndpoints = [];

    try {
      this.logger.log('Fetching all user role ref endpoints from db.');
      userRoleRefEndpoints = await this.userRoleRefEndpointRepository
        .createQueryBuilder('userRoleRefEndpoint')
        .leftJoinAndSelect('userRoleRefEndpoint.userRoleRef', 'userRoleRef')
        .where('userRoleRef.inactivatedTime is NULL')
        .andWhere('userRoleRefEndpoint.inactivatedTime is NULL')
        .getMany();

      if (userRoleRefEndpoints) {
        this.logger.log(
          'Successfully found ' +
            userRoleRefEndpoints.length +
            ' user role ref endpoints in the application.',
        );

        this.redisClient.set(
          AppConstants.APP_CACHE_USER_ROLE_REF_ENDPOINTS,
          JSON.stringify(userRoleRefEndpoints),
        );

        this.logger.log('Successfully cached user role ref endpoints.');
      }
    } catch (error) {
      this.logger.error(
        'Error caching user role ref endpoints with error:' + error,
      );
    }
  }

  private async initUserRoleRefs() {
    this.logger.log('Adding user role refs to redis cache.');
    let userRoleRefs = [];

    try {
      this.logger.log('Fetching all user role refs from db.');
      userRoleRefs = await this.userRoleRefRepository.find({
        where: {
          inactivatedTime: null,
        },
      });

      if (userRoleRefs) {
        this.logger.log(
          'Successfully found ' +
            userRoleRefs.length +
            ' user role refs in the application.',
        );

        this.redisClient.set(
          AppConstants.APP_CACHE_USER_ROLE_REFS,
          JSON.stringify(userRoleRefs),
        );
        this.logger.log('Successfully cached user role refs.');
      }
    } catch (error) {
      this.logger.error(
        'Error caching user role ref labels with error:' + error,
      );
    }
  }

  /**
   *
   * @param cacheKey (should be defined in app constants)
   * @returns
   */
  public async fetchCachedData(cacheKey: string) {
    try {
      Logger.log('Attempting to find cached:' + cacheKey);
      const cachedDataStr = await this.redisClient.get(cacheKey);
      if (cachedDataStr) {
        Logger.log('Cached data found for:' + cacheKey);
        return JSON.parse(cachedDataStr);
      } else {
        Logger.error(cacheKey + ' NOT found in application cache.');
      }
    } catch (error) {
      Logger.error(
        'Error encountered while fetching cache for:' +
          cacheKey +
          ' with error:' +
          error,
      );
      throw new BadRequestException('Error encountered while fetching cached data.');
    }
  }
}
