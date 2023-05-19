import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole, UserRoleRef } from '../entities';
import { Repository } from 'typeorm';
import { UserCommonService } from '../user-common.service';

@Injectable()
export class UserRoleService extends UserCommonService{
  private readonly logger = new Logger(UserRoleService.name);

  constructor(
    @InjectRepository(UserRole, 'druidia')
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(UserRoleRef, 'druidia')
    private readonly userRoleRefRepository: Repository<UserRoleRef>
  ) {
    super();
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

  /**
   * findAllUserRoleRefLabels
   * 
   * @returns - The active user role refs in this application.
   */
  public async findAllUserRoleRefs(){
    Logger.log('Attempting to find all user role refs.');
    try{
      const userRoleRefs = await this.userRoleRefRepository.find({
        where: {
          inactivatedTime: null,
        },
      });

      if(userRoleRefs){
        this.logger.log('Successfully found '+userRoleRefs.length+' user roles in the application.');
        return userRoleRefs;
      }
    }catch(error){
      this.logger.error('Error finding user role ref labels with error:'+error);
      throw new BadRequestException('Error finding user role ref labels.');
    }
  }

  /**
   * findAllUsersHeavyBySearchParams
   * 
   * @param query - if empty then returns all user roles active in system for all users.
   * @returns 
   */
  public async findAllUserRolesHeavyBySearchParams(query: string){
    Logger.log('Attempting to search users (heavy) by criteria:' + query);

    let userRoles = [];

    try {
      if(query && query.trim().length>0){
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
      }else{
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
        userRoles.length + ' user roles found matching search criteria:' + query,
      );
      
      return await Promise.all(userRoles.map(userRole=> this.hydrateUserRole(userRole)));
    } catch (error) {
      Logger.error('Error searching for users:' + error);
      return [];
    }
  }

  private async hydrateUserRole(userRole: UserRole){
    const hydratedUser = await this.hydrateUser(userRole.user);
    userRole.user = hydratedUser;
    return userRole;
  }
}
