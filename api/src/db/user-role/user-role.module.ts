import { Module } from '@nestjs/common';
import { UserRoleController } from './user-role.controller';
import { UserRoleService } from './user-role.service';
import { UserRole } from '../entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageProcessingModule } from '../../image-processing';
import { UserRoleRefModule } from '../user-role-ref/user-role-ref.module';
import { CacheModule } from '../../cache/cache.module';

@Module({
  imports: [
    UserRoleRefModule,
    CacheModule,
    ImageProcessingModule,
    TypeOrmModule.forFeature([UserRole], 'druidia'),
  ],
  providers: [UserRoleService],
  controllers: [UserRoleController],
  exports: [UserRoleService],
})
export class UserRoleModule {}
