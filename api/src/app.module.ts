import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import cors from 'cors';
import helmet from 'helmet';
import { TestModule } from './test/test.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, TestModule],
  providers: [],
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
