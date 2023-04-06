import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../db/user';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.API_APP_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [JwtStrategy, LocalStrategy, AuthService],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
