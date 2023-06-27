import { Module } from '@nestjs/common';
import { UserRoleController } from './user-role.controller';
import { UserRoleService } from './user-role.service';
import { UserRole, User } from '../entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageProcessingModule } from '../image-processing';
import { UserRoleRefModule } from '../user-role-ref/user-role-ref.module';

@Module({
  imports: [
    UserRoleRefModule,
    ImageProcessingModule,
    TypeOrmModule.forFeature([UserRole, User], 'druidia'),
  ],
  providers: [UserRoleService],
  controllers: [UserRoleController],
  exports: [UserRoleService],
})
export class UserRoleModule {}
