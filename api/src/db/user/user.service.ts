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
        .find()
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

  public async findOneByUserName(un: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: {
        username: un,
      },
    });
  }

  public async createUser(createUserDto: CreateUserDto) {
    Logger.log('Attempting to create username:' + createUserDto.username);

    if(createUserDto.password.length < 10){
      throw new BadRequestException('Please enter password >= 10 characters.');
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

    return this.userRepository.save(user).catch((err) => {
      if (err) {
        Logger.error('Error encountered while saving user' + err);
        if(err.code === 'ER_DUP_ENTRY'){
          throw new BadRequestException('Username taken.');
        }
        
        throw new BadRequestException();
      }
    });
  }
}
