import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.API_APP_SECRET,
    });
  }

  /**
   * Here is where passport injects the user object that will be part of the request.
   * This is a good place to hit the database and finish populating more info on the
   * user. This is invoked when your resource is decorated with the jwt auth guard.
   * 
   * @param payload 
   * @returns 
   */
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
