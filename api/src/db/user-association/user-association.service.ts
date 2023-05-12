import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserAssociation } from '../entities';
import { UserCommonService } from '../user-common.service';

@Injectable()
export class UserAssociationService extends UserCommonService{
  private readonly logger = new Logger(UserAssociationService.name);

  constructor(
    @InjectRepository(User, 'druidia')
    private readonly userRepository: Repository<User>,
    
    @InjectRepository(UserAssociation, 'druidia')
    private readonly userAssociationRepository: Repository<UserAssociation>,
  ) {
    super();
  }

  /**
   * findUserAssociationsByUserId
   * 
   * @param userId 
   * @returns 
   */
  public async findUserAssociationsByUserId(userId: number) {
    Logger.log('Attempting to find user associations for user id:' + userId);
    try {
      const userAssociations = await this.userAssociationRepository
        .createQueryBuilder('ua')
        .leftJoin('ua.user', 'u')
        .leftJoinAndSelect('ua.associate', 'a')
        .where('ua.user.id = :userId', { userId })
        .andWhere('ua.inactivatedTime is null')
        .andWhere('a.inactivatedTime is null')//don't get inactivated friends
        .orderBy('a.username')
        .getMany();

      if (userAssociations) {
        Logger.log(
          'Successfully found ' +
            userAssociations.length +
            ' user assocation(s).',
        );

        const friends = userAssociations.map(ua=>{
          return ua.associate;
        });

        //return friends;
        return await Promise.all(friends.map(this.hydrateUser.bind(this)));
      }
    } catch (error) {
      Logger.error('Error finding user associations for user id:' + userId);
    }
  }

  /**
   * createUserAssociation
   * 
   * @param userId 
   * @param associateUserId 
   * @returns 
   */
  public async createUserAssocation(userId:number, associateUserId:number){
    Logger.log(
      'Attempting to create association between userId:' +
        userId +
        ' and associate userId:' +
        associateUserId,
    );

    try{
      const userAssociation: UserAssociation = this.userAssociationRepository.create();
      userAssociation.user = await this.userRepository.findOne({where:{id:userId}});
      userAssociation.associate = await this.userRepository.findOne({where:{id:associateUserId}});
      userAssociation.setAuditFields(userAssociation.user.username);

      //TODO: do i have to fetch the users above or can i create a new user object with just id?
      const savedUserAssociation = await this.userAssociationRepository.save(userAssociation);
      Logger.log('Successfully linked users:'+userId+' and '+associateUserId);
      savedUserAssociation.user.password = '';
      savedUserAssociation.associate.password = '';
      return savedUserAssociation;
    }catch(error){
      Logger.error(
        'Error creating association between userIds:' +
          userId +
          ' and ' +
          associateUserId +
          ' with error:' +
          error,
      );
    }
  }

  /**
   * removeUserAssociation
   * 
   * @param username 
   * @param userId 
   * @param associateUserId 
   * @returns 
   */
  public async removeUserAssociation(username:string, userId:number, associateUserId:number){
    Logger.log(
      'Attempting to remove association between userId:' +
        userId +
        ' and associate userId:' +
        associateUserId,
    );

    try{
      let userAssociation = await this.userAssociationRepository
        .createQueryBuilder('ua')
        .leftJoin('ua.user', 'u')
        .leftJoinAndSelect('ua.associate', 'a')
        .where('ua.user.id = :userId', { userId })
        .andWhere('ua.associate.id = :associateUserId', {associateUserId})
        .andWhere('ua.inactivatedTime is null')
        .getOne();

      if(userAssociation){
        Logger.log('Successfully found user association to remove with id:'+userAssociation.id);
        userAssociation.inactivatedBy = username;
        userAssociation.inactivatedTime = new Date();

        const savedUserAssociation = await this.userAssociationRepository.save(userAssociation);
        Logger.log('Successfully unlinked users:'+userId+' and '+associateUserId);
        savedUserAssociation.associate.password = '';
        return savedUserAssociation;
      }

    }catch(error){
      Logger.error(
        'Error removing association between userIds:' +
          userId +
          ' and ' +
          associateUserId +
          ' with error:' +
          error,
      );
    }
  }
}
