import { Module } from '@nestjs/common';
import { UserRoleRefService } from './user-role-ref.service';
import { UserRoleRef } from '../entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '../../cache/cache.module';

@Module({
  imports: [CacheModule, TypeOrmModule.forFeature([UserRoleRef], 'druidia')],
  providers: [UserRoleRefService],
  controllers: [],
  exports: [UserRoleRefService]
})
export class UserRoleRefModule {}
