import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Interceptor for routes to secure endpoints based off of user role.
 * 
 * Request will have token with user's roles.   This is validated against the
 * resource user wants to access.
 * 
 */
@Injectable()
export class AuthUserGuard implements NestInterceptor {
  private readonly logger = new Logger(AuthUserGuard.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const requestUserId = request.user.id;
    const dto = request.body;

    this.logger.log('Auth user guard user id from request:'+requestUserId);
    this.logger.log('Auth user guard user id from dto body:'+dto.userId);
    
    if (requestUserId && requestUserId === dto.userId) {
      this.logger.log('Auth user guard has matched correct user id. Now proceeding.');
      return next.handle();
    } else {
      Logger.error('User is not authorized to make this request per auth user guard.');
      throw new UnauthorizedException();
    }
  }
}
