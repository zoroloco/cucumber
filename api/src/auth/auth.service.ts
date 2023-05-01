import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../db/user';
import { User } from '../db/entities';
import { JwtService } from '@nestjs/jwt';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    Logger.log('Auth service is validating username:' + username);
    const user = await this.userService.findOneByUserName(false, username);

    if (!user) {
      Logger.error('Cannot find user by username:' + username);
    } else {
      Logger.log('Validating password for username:' + username);
      if ((await bcrypt.compare(pass, user.password)) === true) {
        Logger.log('Successfully validated password for username:' + username);
        const { password, ...result } = user; //strip password out of user object
        return result;
      } else {
        Logger.error('Invalid password for username:' + username);
      }
    }

    return null;
  }

  /**
   * called after validateUser. If validateUser succeeds, then user object
   * will be available below.
   */
  async login(user: any) {
    Logger.log('Logging in username:' + JSON.stringify(user));

    const updatedUser: User = await this.userService.updateUserPostLogin(user);

    const payload = {
      username: updatedUser.username,
      sub: updatedUser.id
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
