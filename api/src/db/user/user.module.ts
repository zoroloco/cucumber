import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserProfile } from '../entities';
import { UserCommonService } from '../user-common.service';
import { UserController,UserService } from '.';
import { ImageGeneratorService, ImageReaderService } from '../../common';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile], 'druidia'),
  ],
  providers: [
    UserCommonService,
    UserService,
    ImageGeneratorService,
    ImageReaderService,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
