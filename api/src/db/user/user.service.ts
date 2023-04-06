import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppConstants } from '../../app.constants';
import { CreateUserDto } from '../../dtos';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User, 'druidia')
    private userRepository: Repository<User>,
  ) {}

  public async findAll(): Promise<void> {
    return new Promise((resolve: any, reject: any) => {
      this.userRepository
        .find({
          select: {
            username: true,
            id: true,
            createdTime: true,
          },
        })
        .then((users: User[]) => {
          this.logger.log('Successfully found ' + users.length + ' users');
          resolve(users);
        })
        .catch((error: any) => {
          this.logger.error('Error finding all users with error:' + error);
          resolve([]); // return empty array
        });
    });
  }

  public async findOneByUserName(concatPw: boolean, un: string): Promise<User | undefined> {
    return this.userRepository.findOne({
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

  public async createUser(createUserDto: CreateUserDto) {
    Logger.log('Attempting to create user:' + createUserDto.username);

    if (createUserDto.username.length > 32) {
      throw new BadRequestException(
        'Username is too long. 32 character limit.',
      );
    }

    if (createUserDto.password.length < 10) {
      throw new BadRequestException(
        'Please enter a minimum of 10 characters for password.',
      );
    }

    //hash the pw
    const saltedPassword: string = await bcrypt.hash(
      createUserDto.password,
      AppConstants.BCRYPT_SALT_ROUNDS,
    );

    //save the new user
    const user: User = new User();
    user.username = createUserDto.username;
    user.password = saltedPassword;
    user.createdBy = 'druidia';
    user.createdTime = new Date();

    try {
      const savedUser = await this.userRepository.save(user);
      Logger.log(
        'Successfully created user:' +
          savedUser.username +
          ' with ID:' +
          savedUser.id,
      );
      const { password, ...result } = savedUser; //strip password out of user object
      return result;
    } catch (err) {
      if (err) {
        Logger.error('Error encountered while saving user' + err);
        if (err.code === 'ER_DUP_ENTRY') {
          throw new BadRequestException('Username taken.');
        }

        throw new BadRequestException('Error encountered while creating user.');
      }
    }
  }
}
