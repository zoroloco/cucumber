import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserAssociation, UserProfile } from '../entities';
import { UserCommonService } from '../user-common.service';
import { UserService } from '../user';
import { UserAssociationController, UserAssociationService } from '.';
import { ImageGeneratorService, ImageReaderService } from '../../common';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile, UserAssociation], 'druidia'),
  ],
  providers: [
    UserCommonService,
    UserService,
    UserAssociationService,
    ImageGeneratorService,
    ImageReaderService,
  ],
  controllers: [UserAssociationController],
  exports: [UserAssociationService],
})
export class UserAssociationModule {}
