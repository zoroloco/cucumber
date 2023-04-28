import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppConstants } from '../../app.constants';
import { CreateUserDto } from '../../dtos';
import { Repository } from 'typeorm';
import { User, UserProfile } from '../entities';
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
    private readonly imageGeneratorService: ImageGeneratorService,
    private readonly imageReaderService: ImageReaderService,
  ) {}

  /**
   *
   * findAll
   */
  public async findAll(): Promise<void> {
    Logger.log('Searching for all active users.');
    return new Promise((resolve: any, reject: any) => {
      this.userRepository
        .find({
          relations: {
            userProfile: true, //joins with userProfile table
          },
          select: {
            username: true,
            id: true,
            createdTime: true,
          },
          where: {
            inactivatedTime: null,
          },
        })
        .then((users: User[]) => {
          this.logger.log(
            'Successfully found ' + users.length + ' active users',
          );
          resolve(users);
        })
        .catch((error: any) => {
          this.logger.error('Error finding all users with error:' + error);
          resolve([]); // return empty array
        });
    });
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

  private async hydrateUser(user) {
    user.password = '';
    const profilePhotoPath = await this.imageGeneratorService.generateImage(
      user.userProfile.profilePhotoPath,
      128,
    );
    if (profilePhotoPath) {
      const profilePhoto = await this.imageReaderService.readImage(profilePhotoPath);
      if(profilePhoto){
        user.profilePhotoFile = profilePhoto;
      }
    }

    return user;
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
    const user: User = new User();
    user.username = createUserDto.username;
    user.password = saltedPassword;
    user.setAuditFields(createUserDto.username);

    const userProfile: UserProfile = new UserProfile();
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
}
