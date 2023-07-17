import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserProfile, UserRole } from '../entities';
import { ImageProcessingModule } from '../image-processing';
import { UserController, UserService } from '.';
import { UserRoleModule } from '../user-role/user-role.module';
import { CacheModule } from '../cache/cache.module';
import { AuthUserRoleGuard } from '../auth';

@Module({
  imports: [
    ImageProcessingModule,
    CacheModule,
    UserRoleModule,
    TypeOrmModule.forFeature([User, UserProfile, UserRole], 'druidia'),
  ],
  providers: [UserService, AuthUserRoleGuard],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
