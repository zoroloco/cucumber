import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleRef } from '../entities';
import { AppConstants } from '../../app.constants';
import { Repository } from 'typeorm';
import { RedisService } from '../../cache';

@Injectable()
export class UserRoleRefService {
  private readonly logger = new Logger(UserRoleRefService.name);

  @Inject(RedisService)
  private readonly redisService: RedisService;

  constructor(
    @InjectRepository(UserRoleRef, 'druidia')
    private readonly userRoleRefRepository: Repository<UserRoleRef>,
  ) {}

  /**
   * findAllUserRoleRefLabels
   *
   * Will fetch from redis store if available. if not then fetches
   * form DB and stores in redis for future cached calls.
   *
   * @returns - The active user role refs in this application.
   */
  public async findAllUserRoleRefs() {
    let userRoleRefs = [];
    try {
      Logger.log('Attempting to find cached user role refs.');
      const cachedUserRoleRefsStr = await this.redisService.redisClient.get(
        AppConstants.APP_CACHE_USER_ROLE_REFS,
      );
      if (cachedUserRoleRefsStr) {
        Logger.log('Cached user role refs found.');
        userRoleRefs = JSON.parse(cachedUserRoleRefsStr);
      } else {
        Logger.log(
          'Cached user role refs NOT found. Now fetching from DB and caching.',
        );

        userRoleRefs = await this.userRoleRefRepository.find({
          where: {
            inactivatedTime: null,
          },
        });

        Logger.log('Caching user role refs for future use');
        this.redisService.redisClient.set(
          AppConstants.APP_CACHE_USER_ROLE_REFS,
          JSON.stringify(userRoleRefs),
        );
      }

      if (userRoleRefs) {
        this.logger.log(
          'Successfully found ' +
            userRoleRefs.length +
            ' user roles in the application.',
        );
        return userRoleRefs;
      }
    } catch (error) {
      this.logger.error(
        'Error finding user role ref labels with error:' + error,
      );
      throw new BadRequestException('Error finding user role ref labels.');
    }
  }
}
