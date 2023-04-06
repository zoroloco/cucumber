import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import cors from 'cors';
import helmet from 'helmet';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [AuthModule, DbModule, LoginModule],
  providers: [],
  controllers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      cors,
      helmet({
        contentSecurityPolicy: true,
        dnsPrefetchControl: true,
        expectCt: true,
        frameguard: true,
        hsts: true,
        ieNoOpen: true,
        noSniff: true,
        permittedCrossDomainPolicies: true,
        referrerPolicy: true,
        xssFilter: true,
        hidePoweredBy: true,
      }),
    );
  }
}
