import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../db/user';
import { JwtService } from '@nestjs/jwt';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByUserName(false,username);

    if (user && (await bcrypt.compare(pass, user.password)) === true) {
      const { password, ...result } = user; //strip password out of user object
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
