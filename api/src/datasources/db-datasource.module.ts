import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User,UserProfile } from '../db/entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'druidia',
      type: 'mysql',
      host: '127.0.0.1',
      port: Number(process.env.MYSQL_PORT),
      username: 'root',
      password: 'root',
      database: 'druidia',
      logging: ['error'],
      entities: [User, UserProfile],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DbDataSourceModule {}
