import { Module } from "@nestjs/common";
import { TestDataSourceModule } from "../datasources";
import { UserModule } from "./user/user.module";

@Module({
  imports: [TestDataSourceModule, UserModule],
  providers: [],
  controllers: [],
  exports: []
})
export class TestModule {}
