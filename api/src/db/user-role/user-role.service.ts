import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../entities';
import { Repository } from 'typeorm';
import { ImageProcessingService } from 'src/image-processing';

@Injectable()
export class UserRoleService {
  private readonly logger = new Logger(UserRoleService.name);

  @Inject(ImageProcessingService)
  private readonly imageProcessingService: ImageProcessingService;

  constructor(
    @InjectRepository(UserRole, 'druidia')
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  /**
   * 
   * @param userRole 
   * @returns 
   */
  public async saveUserRole(userRole: UserRole) {
    Logger.log('Saving user role:' + JSON.stringify(userRole));
    try {
      return this.userRoleRepository.save(userRole);
    } catch (error) {
      Logger.error(
        'Error saving user role:' +
          JSON.stringify(userRole) +
          ' with error:' +
          error,
      );
      throw new BadRequestException('Error saving default user role.');
    }
  }

  /**
   *
   * @param userId
   *
   * @returns - list of active UserRoleRefs for given user ID.
   */
  public async findAllByUserId(userId: number) {
    Logger.log('Attempting to find all user roles for user id:' + userId);
    try {
      const userRoles = await this.userRoleRepository
        .createQueryBuilder('userRole')
        .leftJoin('userRole.user', 'u')
        .leftJoinAndSelect('userRole.userRoleRef', 'userRoleRef')
        .where('userRole.inactivatedTime is null')
        .andWhere('userRoleRef.inactivatedTime is null')
        .andWhere('u.id = :userId', { userId })
        .getMany();

      if (userRoles) {
        this.logger.log(
          'Successfully found:' +
            userRoles.length +
            ' user roles for user ID:' +
            userId,
        );

        return userRoles;
      }
    } catch (error) {
      this.logger.error(
        'Error finding user roles by user id:' +
          userId +
          ' with error:' +
          error,
      );
      throw new BadRequestException('Error finding user roles.');
    }
  }

  /**
   * findAllUsersHeavyBySearchParams
   *
   * @param query - if empty then returns all user active in system for all users.
   * @returns
   */
  public async findAllUserRolesHeavyBySearchParams(query: string) {
    Logger.log('Attempting to search users (heavy) by criteria:' + query);

    let userRoles = [];

    try {
      if (query && query.trim().length > 0) {
        userRoles = await this.userRoleRepository
          .createQueryBuilder('userRole')
          .leftJoinAndSelect('userRole.userRoleRef', 'userRoleRef')
          .leftJoinAndSelect('userRole.user', 'user')
          .leftJoinAndSelect('user.userProfile', 'userProfile')
          .where('userProfile.firstName LIKE :query', { query: `%${query}%` })
          .orWhere('userProfile.lastName LIKE :query', { query: `%${query}%` })
          .orWhere('user.username LIKE :query', { query: `%${query}%` })
          .andWhere('user.inactivatedTime is null')
          .andWhere('userRole.inactivatedTime is null')
          .andWhere('userRoleRef.inactivatedTime is null')
          .orderBy('user.username')
          .getMany();
      } else {
        Logger.log('Searching for all users with user roles.');
        userRoles = await this.userRoleRepository
          .createQueryBuilder('userRole')
          .leftJoinAndSelect('userRole.userRoleRef', 'userRoleRef')
          .leftJoinAndSelect('userRole.user', 'user')
          .leftJoinAndSelect('user.userProfile', 'userProfile')
          .where('user.inactivatedTime is null')
          .andWhere('userRole.inactivatedTime is null')
          .andWhere('userRoleRef.inactivatedTime is null')
          .orderBy('user.username')
          .getMany();
      }

      Logger.log(
        userRoles.length +
          ' user roles found matching search criteria:' +
          query,
      );

      return await Promise.all(
        userRoles.map((userRole) => this.hydrateUserRole(userRole)),
      );
    } catch (error) {
      Logger.error('Error searching for users:' + error);
      return [];
    }
  }

  private async hydrateUserRole(userRole: UserRole) {
    const hydratedUser = await this.imageProcessingService.hydrateUserProfilePhoto(userRole.user);
    userRole.user = hydratedUser;
    return userRole;
  }
}
