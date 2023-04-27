import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User,UserProfile } from '../entities';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User,UserProfile], 'druidia')],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
