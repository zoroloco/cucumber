import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppConstants } from '../../app.constants';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller(AppConstants.TEST)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/users')
  @ApiTags(AppConstants.TEST_GET_USERS)
  @ApiResponse({
    status: 200,
    description: AppConstants.TEST_USERS,
    type: User,
  })
  findAll() {
    return this.userService.findAll();
  }
}
