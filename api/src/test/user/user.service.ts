import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User, 'test')
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
}
