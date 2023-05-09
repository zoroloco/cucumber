import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppConstants } from '../../app.constants';
import { CreateUserDto } from '../../dtos';
import { Repository } from 'typeorm';
import { User, UserAssociation, UserProfile } from '../entities';
import { ImageGeneratorService, ImageReaderService } from '../../common';
const bcrypt = require('bcrypt');
const fs = require('fs');

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User, 'druidia')
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile, 'druidia')
    private readonly userProfileRepository: Repository<UserProfile>,
    @InjectRepository(UserAssociation, 'druidia')
    private readonly userAssociationRepository: Repository<UserAssociation>,
    private readonly imageGeneratorService: ImageGeneratorService,
    private readonly imageReaderService: ImageReaderService,
  ) {}

  /**
   *
   * findAll
   */
  public async findAll() {
    Logger.log('Searching for all active users.');

    try {
      const users = await this.userRepository.find({
        select: {
          username: true,
          id: true,
          createdTime: true,
        },
        where: {
          inactivatedTime: null,
        },
      });

      return await Promise.all(users.map(this.hydrateUser.bind(this)));
    } catch (error) {
      Logger.error('Error finding all users:' + error);
    }
  }

  /**
   * findOneByUserName
   */
  public async findOneByUserName(
    concatPw: boolean,
    un: string,
  ): Promise<User | undefined> {
    Logger.log('Attempting to search user by username:' + un);

    return this.userRepository.findOne({
      relations: {
        userProfile: true, //joins with userProfile table
      },
      select: {
        username: true,
        password: !concatPw,
        id: true,
        createdTime: true,
      },
      where: {
        username: un,
      },
    });
  }

  /**
   * findUsersBySearchCriteria
   *
   * Sends back users matching search criteria with user profile photo as well.
   */
  public async findUsersBySearchCriteria(query: string) {
    Logger.log('Attempting to search users by criteria:' + query);
    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.userProfile', 'userProfile')
        .where('userProfile.firstName LIKE :query', { query: `%${query}%` })
        .orWhere('userProfile.lastName LIKE :query', { query: `%${query}%` })
        .orWhere('user.username LIKE :query', { query: `%${query}%` })
        .andWhere('user.inactivatedTime is null')
        .getMany();

      Logger.log(
        users.length + ' user(s) found matching search criteria:' + query,
      );

      return await Promise.all(users.map(this.hydrateUser.bind(this)));
    } catch (error) {
      Logger.error('Error searching for users:' + error);
      return [];
    }
  }

  /**
   *
   * @param user
   * @returns - user with user profile photo
   */
  private async hydrateUser(user:User) {
    user.password = '';

    const userProfile = await user.userProfile;//lazy load

    const profilePhotoPath = await this.imageGeneratorService.generateImage(
      userProfile.profilePhotoPath,
      128,
    );
    if (profilePhotoPath) {
      const profilePhoto = await this.imageReaderService.readImage(
        profilePhotoPath,
      );
      if (profilePhoto) {
        user.profilePhotoFile = profilePhoto;
      }
    }

    return user;
  }

  public async updateUserPostLogin(user: User) {
    Logger.log('Updating user ID:' + user.id);
    try {
      await this.userRepository.update(user.id, {
        lastLoginTime: new Date(),
      });

      return this.userRepository.findOne({
        where: {
          id: user.id,
        },
      });
    } catch (error) {
      Logger.error('Error updating user:' + error);
    }
  }

  /**
   * createUser
   */
  public async createUser(
    createUserDto: CreateUserDto,
    profilePhotoPath: string,
  ) {
    Logger.log('Attempting to create user:' + createUserDto.username);

    //hash the pw
    const saltedPassword: string = await bcrypt.hash(
      createUserDto.password,
      AppConstants.BCRYPT_SALT_ROUNDS,
    );

    //save the new user
    //Note: we are instantiating the entities with the repository create() method so some
    //validation checks will occur.  This is better than using 'new' operator.
    const user: User = this.userRepository.create();
    user.username = createUserDto.username;
    user.password = saltedPassword;
    user.setAuditFields(createUserDto.username);

    const userProfile: UserProfile = this.userProfileRepository.create();
    userProfile.firstName = createUserDto.firstName;
    userProfile.middleName = createUserDto.middleName;
    userProfile.lastName = createUserDto.lastName;
    userProfile.profilePhotoPath = profilePhotoPath;
    userProfile.setAuditFields(createUserDto.username);

    try {
      const savedUserProfile = await this.userProfileRepository.save(
        userProfile,
      );
      Logger.log(
        'User Profile successfully created:' + JSON.stringify(savedUserProfile),
      );

      user.userProfile = savedUserProfile; //foreign key

      const savedUser = await this.userRepository.save(user);
      Logger.log('User successfully created:' + JSON.stringify(savedUser));
      const { password, ...userNoPass } = savedUser; //strip password out of user object
      return userNoPass;
    } catch (err) {
      if (err) {
        Logger.error('Error encountered while creating user' + err);
        if (err.code === 'ER_DUP_ENTRY') {
          throw new BadRequestException('Username taken.');
        }

        throw new BadRequestException('Error encountered while creating user.');
      }
    }
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
      const savedUserAssocation = this.userAssociationRepository.save(userAssociation);
      Logger.log('Successfully linked users:'+userId+' and '+associateUserId);
      return savedUserAssocation;
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
}
