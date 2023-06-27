import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole, User, UserRoleRef } from '../entities';
import { Repository } from 'typeorm';
import { ImageProcessingService } from 'src/image-processing';

@Injectable()
export class UserRoleService {
  private readonly logger = new Logger(UserRoleService.name);

  @Inject(ImageProcessingService)
  private readonly imageProcessingService: ImageProcessingService;


  private userNameCache = [];

  constructor(
    @InjectRepository(UserRole, 'druidia')
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(User, 'druidia')
    private readonly userRepository: Repository<User>,
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
   *
   * @param reqUserId
   * @param userId
   * @param userRoleRefId
   */
  public async createUserRole(
    reqUserId: number,
    userId: number,
    userRoleRefId: number,
  ) {
    Logger.log(
      'Attempting to create user role for userId:' +
        userId +
        ' and userRoleRefId:' +
        userRoleRefId,
    );
    try {
      const userRole: UserRole = this.userRoleRepository.create();

      userRole.setAuditFields(reqUserId);

      const user: User = this.userRepository.create();
      user.id = userId;

      const userRoleRef: UserRoleRef = new UserRoleRef();
      userRoleRef.id = userRoleRefId;

      userRole.user = user;
      userRole.userRoleRef = userRoleRef;

      this.userRoleRepository.save(userRole); //async, lets no wait for this and just return.
      Logger.log('Saving new user role.');
    } catch (error) {
      Logger.error(
        'Error creating user role with userId:' +
          userId +
          ' and userRoleRefId:' +
          userRoleRefId +
          ' with error:' +
          error,
      );
      throw new BadRequestException('Error encountered creating user role.');
    }
  }

  /**
   *
   * @param reqUserId
   * @param userId
   * @param userRoleRefId
   */
  public async removeUserRole(
    reqUserId: number,
    userId: number,
    userRoleRefId: number,
  ) {
    Logger.log(
      'Attempting to remove user role ref id:' +
        userRoleRefId +
        ' from userId:' +
        userId,
    );

    try {
      const userRole = await this.userRoleRepository
        .createQueryBuilder('userRole')
        .where('userRole.user.id LIKE :userId', { userId: `%${userId}%` })
        .where('userRole.userRoleRef.id LIKE :userRoleRefId', {
          userRoleRefId: `%${userRoleRefId}%`,
        })
        .andWhere('userRole.inactivatedTime is null')
        .getOne();

      if (userRole) {
        Logger.log(
          'Successfully found active user role to deactivate with user role id:' +
            userRole.id,
        );

        userRole.inactivatedBy = reqUserId;
        userRole.inactivatedTime = new Date();

        const savedUserRole = await this.userRoleRepository.save(userRole);
        if (savedUserRole) {
          Logger.log(
            'Successfully deactivated user role id:' + savedUserRole.id,
          );
        }
      }
    } catch (error) {
      Logger.error(
        'Error removing user role ref id:' +
          userRoleRefId +
          ' for userId' +
          userId +
          ' with error:' +
          error,
      );
      throw new BadRequestException('Error encountered removing user role.');
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
    const hydratedUser =
      await this.imageProcessingService.hydrateUserProfilePhoto(userRole.user);
    userRole.user = hydratedUser;
    return userRole;
  }
}
