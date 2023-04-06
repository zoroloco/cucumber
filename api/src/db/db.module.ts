import { Module } from "@nestjs/common";
import { DbDataSourceModule } from "../datasources";
import { UserModule } from "./user/user.module";

@Module({
  imports: [DbDataSourceModule, UserModule],
  providers: [],
  controllers: [],
  exports: []
})
export class DbModule {}