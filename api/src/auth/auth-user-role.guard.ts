import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RedisService } from '../cache';
import { AppConstants } from 'src/app.constants';

/**
 * Interceptor for routes to secure endpoints based off of user role.
 *
 * Request will have token with user's roles.   This is validated against the
 * resource user wants to access.
 *
 */
@Injectable()
export class AuthUserRoleGuard implements CanActivate {
  private readonly logger = new Logger(AuthUserRoleGuard.name);

  @Inject(RedisService)
  private readonly redisService: RedisService;

  private cachedUserRoleRefEndopints = [];

  private async initData() {
    this.logger.log('initData');
    this.cachedUserRoleRefEndopints = await this.redisService.fetchCachedData(
      AppConstants.APP_CACHE_USER_ROLE_REF_ENDPOINTS,
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    //do just first time
    if (!this.cachedUserRoleRefEndopints.length) {
      await this.initData();
    }
    if (request.user.userId) {
      this.logger.log('User id from request:' + request.user.userId);
      this.logger.log('User roles from request:' + request.user.userRoles);
      const urlPath: string = request.url;

      if (urlPath && urlPath.trim().length > 4) {
        //chop off /api
        let endPointPath: string = urlPath.substring(4, urlPath.length);

        //chop off everything after second slash if exists
        if (-1 != endPointPath.indexOf('/', 1)) {
          endPointPath = endPointPath.substring(
            0,
            endPointPath.indexOf('/', 1),
          );
        }

        this.logger.log('Parsed URL:' + endPointPath);

        const guardResult: boolean =
          this.cachedUserRoleRefEndopints
            .filter((e) => e.endPoint === endPointPath)
            .filter((u) =>
              request.user.userRoles.find(
                (ur) => ur === u.userRoleRef.roleName,
              ),
            ).length > 0;

        this.logger.log(
          'User with userId:' +
            request.user.userId +
            ' tried to access:' +
            endPointPath +
            ' and the guard response was:' +
            guardResult,
        );
        return guardResult;
      }
    } else {
      Logger.error('User is not authorized to make this request.');
      throw new UnauthorizedException();
    }

    Logger.error('User not authorized to make this request.');
    return false; //guard DENIED
  }
}
