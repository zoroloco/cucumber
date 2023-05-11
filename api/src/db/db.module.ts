import { Module } from "@nestjs/common";
import { DbDataSourceModule } from "../datasources";
import { UserModule } from "./user/user.module";
import { UserAssociationModule } from "./user-association/user-association.module";

@Module({
  imports: [DbDataSourceModule, UserModule, UserAssociationModule],
  providers: [],
  controllers: [],
  exports: []
})
export class DbModule {}