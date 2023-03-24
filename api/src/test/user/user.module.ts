import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User], 'test')],
  providers: [UserService],
  controllers: [UserController],
  exports: [],
})
export class UserModule {}
