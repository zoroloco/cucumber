import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User,UserProfile,UserAssociation } from '../db/entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'druidia',
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      logging: ['error'],
      entities: [User, UserProfile, UserAssociation],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DbDataSourceModule {}
