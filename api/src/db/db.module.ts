import { Module } from '@nestjs/common';
import { DbDataSourceModule } from '../datasources';
import { UserModule } from '../user/user.module';
import { UserRoleModule } from '../user-role/user-role.module';

@Module({
  imports: [
    DbDataSourceModule,
    UserModule,
    UserRoleModule
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class DbModule {}
