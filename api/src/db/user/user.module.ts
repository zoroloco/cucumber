import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User,UserAssociation,UserProfile } from '../entities';
import { UserService } from './user.service';
import { ImageGeneratorService, ImageReaderService } from '../../common';

@Module({
  imports: [TypeOrmModule.forFeature([User,UserProfile,UserAssociation], 'druidia')],
  providers: [UserService, ImageGeneratorService, ImageReaderService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
