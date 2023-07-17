import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserAssociation } from '../entities';
import { UserAssociationController, UserAssociationService } from '.';
import { ImageProcessingModule } from '../image-processing';
import { AuthUserRoleGuard } from '../auth';

@Module({
  imports: [
    ImageProcessingModule,
    TypeOrmModule.forFeature([User, UserAssociation], 'druidia'),
  ],
  providers: [
    UserAssociationService, AuthUserRoleGuard
  ],
  controllers: [UserAssociationController],
  exports: [UserAssociationService],
})
export class UserAssociationModule {}
