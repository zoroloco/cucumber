import { Module } from '@nestjs/common';
import { UserRoleController } from './user-role.controller';
import { UserRoleService } from './user-role.service';
import { UserRole, UserRoleRef } from '../entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageGeneratorService, ImageReaderService } from '../../common';

@Module({
  imports: [TypeOrmModule.forFeature([UserRoleRef, UserRole], 'druidia')],
  providers: [UserRoleService, ImageGeneratorService, ImageReaderService],
  controllers: [UserRoleController],
  exports: [UserRoleService],
})
export class UserRoleModule {}
