import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  getSchemaPath
} from '@nestjs/swagger';
import { AppConstants } from '../../app.constants';
import { SearchUserDto, CreateUserDto } from '../../dtos';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';

@Controller(AppConstants.API_PATH)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * createUser
   *
   * @param createUserDto
   * @returns - created user object with password ommitted.
   */
  @ApiTags(AppConstants.API_TAG)
  @ApiResponse({
    description: AppConstants.CREATE_USER_DESC,
    type: CreateUserDto,
  })
  @ApiOperation({ summary: AppConstants.CREATE_USER_DESC })
  @Post(AppConstants.CREATE_USER)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  /**
   * findAll
   *
   * @returns - All users in system.
   */
  @UseGuards(JwtAuthGuard)
  @Get(AppConstants.FIND_ALL_USERS)
  @ApiTags(AppConstants.API_TAG)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: AppConstants.FIND_ALL_USERS_DESC,
    type: [User]
  })
  @ApiOperation({ summary: AppConstants.FIND_ALL_USERS_DESC })
  findAll() {
    return this.userService.findAll();
  }

  /**
   * findOneByUserName
   *
   * @param searchUserDto
   * @returns - The user if found. NotFoundException otherwise.
   */
  @UseGuards(JwtAuthGuard)
  @Post(AppConstants.FIND_USER_BY_USERNAME)
  @ApiBearerAuth()
  @ApiTags(AppConstants.API_TAG)
  @ApiResponse({
    description: AppConstants.FIND_USER_BY_USERNAME_DESC,
    type: User,
  })
  @ApiOperation({ summary: AppConstants.FIND_USER_BY_USERNAME_DESC })
  async findOneByUserName(@Body() searchUserDto: SearchUserDto) {
    const user: User = await this.userService.findOneByUserName(
      true,
      searchUserDto.username,
    );
    if (null === user) {
      throw new NotFoundException('Not found.');
    }

    return user;
  }

  /**
   * findUsersBySearchCriteria
   *
   * @param string
   * @returns - List of users matching search criteria.
   */
  @UseGuards(JwtAuthGuard)
  @Post(AppConstants.FIND_USERS_BY_SEARCH_PARAMS)
  @ApiBearerAuth()
  @ApiTags(AppConstants.API_TAG)
  @ApiBody(
    {
      type: SearchUserDto,
      examples:{
        example: {
          value: {
            username: 'NA',
            firstName: 'NA',
            lastName: 'NA',
            query: 'john@doe.org'
          }
        }
      }
    }
  )
  @ApiResponse({
    status: 200,
    description: AppConstants.FIND_USERS_BY_SEARCH_PARAMS_DESC,    
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(User),
        example: {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          username: 'john@doe.org'
        }
      }
    }   
  })
  @ApiOperation({ summary: AppConstants.FIND_USERS_BY_SEARCH_PARAMS_DESC })
  async findUsersBySearchCriteria(@Body() searchUserDto: SearchUserDto) {
    return await this.userService.findUsersBySearchCriteria(searchUserDto.query);
  }
}
