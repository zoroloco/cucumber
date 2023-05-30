import {
  BadRequestException,
  Injectable,
  Inject,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppConstants } from '../../app.constants';
import { CreateUserDto } from '../../dtos';
import { Repository } from 'typeorm';
import { User, UserProfile, UserRole } from '../entities';
import { UserRoleService } from '../user-role';
import { ImageProcessingService } from 'src/image-processing';
import { UserRoleRefService } from '../user-role-ref';
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  @Inject(UserRoleService)
  private readonly userRoleService: UserRoleService;

  @Inject(UserRoleRefService)
  private readonly userRoleRefService: UserRoleRefService;

  @Inject(ImageProcessingService)
  private readonly imageProcessingService: ImageProcessingService;

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
        users.map(this.imageProcessingService.hydrateUserProfilePhoto.bind(this)),
      );
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
        .orderBy('user.username')
        .getMany();

      Logger.log(
        users.length + ' user(s) found matching search criteria:' + query,
      );

      return await Promise.all(
        users.map(this.imageProcessingService.hydrateUserProfilePhoto.bind(this)),
      );
    } catch (error) {
      Logger.error('Error searching for users:' + error);
      return [];
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

      //now save a default user role for the user async
      const noobUserRole: UserRole = this.userRoleRepository.create();
      noobUserRole.setAuditFields(savedUser.username);
      noobUserRole.user = savedUser;
      const userRoleRefs = await this.userRoleRefService.findAllUserRoleRefs();
      noobUserRole.userRoleRef = userRoleRefs.find(
        (urr) => urr.roleName === 'ROLE_NOOB',
      );
      this.userRoleService.saveUserRole(noobUserRole);
      
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
