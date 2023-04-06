import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppConstants } from '../../app.constants';
import { SearchUserDto, CreateUserDto } from '../../dtos';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';

@Controller(AppConstants.API_PATH)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags(AppConstants.API_TAG)
  @ApiResponse({
    description: AppConstants.CREATE_USER_DESC,
    type: CreateUserDto,
  })
  @ApiOperation({ summary: AppConstants.CREATE_USER_DESC})
  @Post(AppConstants.CREATE_USER)
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(AppConstants.FIND_ALL_USERS)
  @ApiTags(AppConstants.API_TAG)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: AppConstants.FIND_ALL_USERS_DESC,
    type: User,
  })
  @ApiOperation({summary: AppConstants.FIND_ALL_USERS_DESC})
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post(AppConstants.FIND_USER_BY_USERNAME)
  @ApiBearerAuth()
  @ApiTags(AppConstants.API_TAG)
  @ApiResponse({
    description: AppConstants.FIND_USER_BY_USERNAME_DESC,
    type: User,
  })
  @ApiOperation({summary: AppConstants.FIND_USER_BY_USERNAME_DESC})
  async findOneByUserName(@Body() searchUserDto: SearchUserDto) {
    const user: User = await this.userService.findOneByUserName(
      searchUserDto.username,
    );
    if (null === user) {
      throw new NotFoundException('Not found.');
    }

    return user;
  }
}
