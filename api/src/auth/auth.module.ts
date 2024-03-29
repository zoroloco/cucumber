import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserRoleModule } from '../user-role/user-role.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    CacheModule,
    JwtModule.register({
      secret: process.env.API_APP_SECRET,
      signOptions: { expiresIn: '86400s' },
    }),
    UserRoleModule
  ],
  providers: [JwtStrategy, LocalStrategy, AuthService],
  exports: [PassportModule, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
