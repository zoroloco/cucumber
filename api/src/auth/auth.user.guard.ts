import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UnauthorizedException,Logger } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthUserGuard implements NestInterceptor {
  constructor(private readonly getUserId: (request: Request) => string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const expectedUserId = this.getUserId(request);
    const user = request.user;
    if (user && user.id === expectedUserId) {
      return next.handle();
    } else {
      Logger.error('User is not authorized to make this request.');
      throw new UnauthorizedException();
    }
  }
}
