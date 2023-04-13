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
    Logger.log('Auth service is validating username:'+username);
    const user = await this.userService.findOneByUserName(false,username);
   
    if(!user){
      Logger.error('Cannot find user by username:'+username);
    }else{
      Logger.log('Validating password for username:'+username);
      if (await bcrypt.compare(pass, user.password) === true) {
        Logger.log('Successfully validated password for username:'+username);
        const { password, ...result } = user; //strip password out of user object
        return result;
      }else{
        Logger.error('Invalid password for username:'+username);
      }
    }
    
    return null;
  }

  async login(user: any) {
    Logger.log('Logging in username:'+JSON.stringify(user));
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
