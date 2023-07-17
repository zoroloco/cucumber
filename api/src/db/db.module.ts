import { Module } from '@nestjs/common';
import { DbDataSourceModule } from '../datasources';
import { UserModule } from '../user/user.module';
import { UserAssociationModule } from '../user-association/user-association.module';
import { UserRoleModule } from '../user-role/user-role.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    DbDataSourceModule,
    UserModule,
    UserAssociationModule,
    UserRoleModule,
    ChatModule
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class DbModule {}
