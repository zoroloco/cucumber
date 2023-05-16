import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole, UserRoleRef } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserRoleService {
  private readonly logger = new Logger(UserRoleService.name);

  constructor(
    @InjectRepository(UserRole, 'druidia')
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  /**
   *
   * @param userId
   *
   * @returns - list of active UserRoleRefs for given user ID.
   */
  public async findAllByUserId(userId: number) {
    Logger.log('Attemptig to find all user roles for user id:' + userId);
    try {
      const userRoleRefs = await this.userRoleRepository
        .createQueryBuilder('userRole')
        .leftJoin('userRole.user', 'u')
        .leftJoinAndSelect('userRole.userRoleRef', 'userRoleRef')
        .where('userRole.inactivatedTime is null')
        .andWhere('userRoleRef.inactivatedTime is null')
        .andWhere('u.id = :userId', { userId })
        .getMany();

      if (userRoleRefs) {
        this.logger.log(
          'Successfully found:' +
            userRoleRefs.length +
            ' user roles for user ID:' +
            userId,
        );

        return userRoleRefs;
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
}
