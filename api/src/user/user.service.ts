import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageProcessingService } from 'src/image-processing';
import { Repository } from 'typeorm';
import { AppConstants } from '../app.constants';
import { RedisService } from '../cache/redis.service';
import { CreateUserDto } from '../dtos';
import { User, UserProfile, UserRole } from '../entities';
import { UserRoleService } from '../user-role';
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  @Inject(UserRoleService)
  private readonly userRoleService: UserRoleService;

  @Inject(ImageProcessingService)
  private readonly imageProcessingService: ImageProcessingService;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  constructor(
    @InjectRepository(User, 'druidia')
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile, 'druidia')
    private readonly userProfileRepository: Repository<UserProfile>,
    @InjectRepository(UserRole, 'druidia')
    private readonly userRoleRepository: Repository<UserRole>,
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
        order: {
          username: 'DESC',
        },
      });

      return await Promise.all(
        users.map(
          this.imageProcessingService.hydrateUserProfilePhoto.bind(this),
        ),
      );
    } catch (error) {
      Logger.error('Error finding all users:' + error);
      throw new BadRequestException(
        'Error encountered while finding all users.',
      );
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
   * findUserProfilePhotoForUser
   *
   * @returns - the base64 encoded user profile photo for the requesting user.
   */
  public async findUserProfilePhotoForUser(reqUserId: number) {
    Logger.log(
      'Attempting to search user profile photo for user id:' + reqUserId,
    );

    try {
      let user: User = await this.userRepository.findOne({
        relations: {
          userProfile: true, //joins with userProfile table
        },
        select: {
          id: true,
        },
        where: {
          id: reqUserId,
        },
      });

      if (user) {
        Logger.log(
          'Successfully found user profile id for user id:' + reqUserId,
        );

        const hydratedUser: User =
          await this.imageProcessingService.hydrateUserProfilePhoto(user);
        return hydratedUser.profilePhotoFile;
      }
    } catch (error) {
      Logger.error('Error finding user profile photo:' + error);
      throw new BadRequestException(
        'Error encountered while finding user profile photo.',
      );
    }
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
        .orderBy('user.username')
        .getMany();

      Logger.log(
        users.length + ' user(s) found matching search criteria:' + query,
      );

      return await Promise.all(
        users.map(
          this.imageProcessingService.hydrateUserProfilePhoto.bind(this),
        ),
      );
    } catch (error) {
      Logger.error('Error searching for users:' + error);
      throw new BadRequestException(
        'Error encountered searching users by search criteria.',
      );
    }
  }

  public async updateUserProfileImage(reqUserId: number, fileName: string) {
    Logger.log('Updating user profile image for user id:' + reqUserId);
    try {
      const user = await this.userRepository.findOne({
        relations: {
          userProfile: true, //joins with userProfile table
        },
        select: {
          username: true,
          id: true,
          createdTime: true,
        },
        where: {
          id: reqUserId,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.userProfile) {
        throw new NotFoundException('User profile not found');
      }

      user.userProfile.profilePhotoPath = fileName;
      await this.userProfileRepository.save(user.userProfile);

      return user;
    } catch (error) {
      Logger.error('Error updating user:' + error);
      throw new BadRequestException(
        'Error encountered while updating user login information.',
      );
    }
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
      throw new BadRequestException(
        'Error encountered while updating user login information.',
      );
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
    user.setAuditFields(0);

    const userProfile: UserProfile = this.userProfileRepository.create();
    userProfile.firstName = createUserDto.firstName;
    userProfile.middleName = createUserDto.middleName;
    userProfile.lastName = createUserDto.lastName;
    userProfile.profilePhotoPath = profilePhotoPath;
    userProfile.setAuditFields(0);

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

      //now save a default user role for the user async
      const noobUserRole: UserRole = this.userRoleRepository.create();
      noobUserRole.setAuditFields(savedUser.id);
      noobUserRole.user = savedUser;
      const userRoleRefs = await this.redisService.fetchCachedData(
        AppConstants.APP_CACHE_USER_ROLE_REFS,
      );
      noobUserRole.userRoleRef = userRoleRefs.find(
        (urr) => urr.roleName === 'ROLE_NOOB',
      );

      //NOTE: This can be async. Why wait? User won't be logging in so fast now.
      const savedNoobUserRole = await this.userRoleService.saveUserRole(
        noobUserRole,
      );
      if (savedNoobUserRole) {
        Logger.log('Successfully saved a noob.');
      }

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
