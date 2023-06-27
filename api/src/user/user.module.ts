import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserProfile, UserRole } from '../entities';
import { ImageProcessingModule } from '../image-processing';
import { UserController, UserService } from '.';
import { UserRoleModule } from '../user-role/user-role.module';
import { UserRoleRefModule } from '../user-role-ref/user-role-ref.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [
    ImageProcessingModule,
    CacheModule,
    UserRoleModule,
    UserRoleRefModule,
    TypeOrmModule.forFeature([User, UserProfile, UserRole], 'druidia'),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
