import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { AppConstants } from '../app.constants';
import { LoginUserDto } from '../dtos';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller(AppConstants.AUTH_PATH)
export class LoginController {
  constructor(private authService: AuthService) {}

  /**
   * Since the login method is decorated with the 'local'
   * guard, then the local.strategy validate method will be invoked.
   * This calls auth service validate which checks database for
   * valid credentials. If valid, then passport will populate the request's user
   * object.  If all of this is satisfied, then we make it to this login method
   * below and call the auth service login method with the user.  This will
   * return a signed JWT token that can be used in future calls and have the user
   * context.
   *
   * @param req
   * @returns
   */
  @UseGuards(LocalAuthGuard)
  @ApiTags(AppConstants.AUTH_TAG)
  @ApiResponse({
    description: AppConstants.LOGIN_DESC,
    type: LoginUserDto
  })
  @ApiOperation({summary: AppConstants.LOGIN_DESC})
  @Post(AppConstants.LOGIN)
  async login(@Request() req, @Body() loginUserDto: LoginUserDto) {
    return this.authService.login(req.user);
  }
}
