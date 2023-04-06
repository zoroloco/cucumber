import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { LoginController } from './login.controller';

@Module({
    imports: [AuthModule],
    providers: [],
    controllers: [LoginController],
    exports: []
})
export class LoginModule {}