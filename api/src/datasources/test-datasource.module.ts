import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../test/user';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'test',
      type: 'mysql',
      host: process.env.API_DB_HOST,
      port: 3306,
      username: process.env.API_DB_USERNAME,
      password: process.env.API_DB_PASSWORD,
      database: process.env.API_DB_NAME,
      logging: ['error'],
      entities: [User],
    }),
  ],
  exports: [TypeOrmModule],
})
export class TestDataSourceModule {}
