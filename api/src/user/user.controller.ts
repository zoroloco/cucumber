import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  NotFoundException,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  UseInterceptors,
  Logger,
  Request,
  Header
} from '@nestjs/common';
import { JwtAuthGuard, AuthUserRoleGuard } from '../auth';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  getSchemaPath,
} from '@nestjs/swagger';
import { AppConstants } from '../app.constants';
import { SearchUserDto, CreateUserDto } from '../dtos';
import { User } from '../entities';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

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
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example: {
        value: {
          username: 'john@doe.net',
          password: 'password',
          firstName: 'John',
          middleName: 'Jacob',
          lastName: 'Jingleheimer-Schmidt',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: AppConstants.CREATE_USER_DESC,
    type: CreateUserDto,
  })
  @ApiOperation({ summary: AppConstants.CREATE_USER_DESC })
  @Post(AppConstants.CREATE_USER)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = path.extname(file.originalname);
          const newFileName = file.fieldname + '-' + uniqueSuffix + extension;
          Logger.log('filename interceptor renaming file to:' + newFileName);
          if (!extension.match(/\.(jpg|jpeg|png|JPEG|JPG)$/)) {
            cb(
              new Error(
                'jpg|jpeg|png|JPG|JPEG are the only allowed file types.',
              ),
              newFileName,
            );
          }
          cb(null, newFileName);
        },
      }),
    }),
  )
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 15000000 }), //15mb max size
        ],
      }),
    )
    file: any,
  ) {
    return this.userService.createUser(createUserDto, file.filename);
  }

  /**
   * findAll
   *
   * @returns - All users in system.
   */
  @UseGuards(JwtAuthGuard, AuthUserRoleGuard)
  @Get('find-all-users')
  @ApiTags(AppConstants.API_TAG)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Returns all active users. With user profile info.',
    type: [User],
  })
  @ApiOperation({ summary: 'Returns all active users. With user profile info.' })
  findAllUsers() {
    return this.userService.findAll();
  }

  /**
   * findOneByUserName
   *
   * @param searchUserDto
   * @returns - The user if found. NotFoundException otherwise.
   */
  @UseGuards(JwtAuthGuard, AuthUserRoleGuard)
  @Post(AppConstants.FIND_USER_BY_USERNAME)
  @ApiBearerAuth()
  @ApiTags(AppConstants.API_TAG)
  @ApiResponse({
    status: 201,
    description: AppConstants.FIND_USER_BY_USERNAME_DESC,
    type: User,
  })
  @ApiOperation({ summary: AppConstants.FIND_USER_BY_USERNAME_DESC })
  async findOneByUserName(@Body() searchUserDto: SearchUserDto) {
    const user: User = await this.userService.findOneByUserName(
      true,
      searchUserDto.searchQuery,
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
  @UseGuards(JwtAuthGuard, AuthUserRoleGuard)
  @Post(AppConstants.FIND_USERS_BY_SEARCH_PARAMS)
  @ApiBearerAuth()
  @ApiTags(AppConstants.API_TAG)
  @ApiBody({
    type: SearchUserDto,
    examples: {
      example: {
        value: {
          searchQuery: 'john@doe.org',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: AppConstants.FIND_USERS_BY_SEARCH_PARAMS_DESC,
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(User),
        example: {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          username: 'john@doe.org',
        },
      },
    },
  })
  @ApiOperation({ summary: AppConstants.FIND_USERS_BY_SEARCH_PARAMS_DESC })
  async findUsersBySearchCriteria(@Body() searchUserDto: SearchUserDto) {
    return await this.userService.findUsersBySearchCriteria(
      searchUserDto.searchQuery,
    );
  }

  /**
   * findUserProfilePhotoForUser
   *
   * @returns - base 64 encoded user profile image for the requesting user.
   */
  @UseGuards(JwtAuthGuard, AuthUserRoleGuard)
  @Get(AppConstants.FIND_USER_PROFILE_PHOTO_FOR_USER)
  @Header('Content-Type', 'image/png') 
  @Header('Cache-Control', 'public, max-age=3600')
  @ApiTags(AppConstants.API_TAG)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: AppConstants.FIND_USER_PROFILE_PHOTO_FOR_USER_DESC,
  })
  @ApiOperation({
    summary: AppConstants.FIND_USER_PROFILE_PHOTO_FOR_USER_DESC,
  })
  findUserProfilePhotoForUser(@Request() req) {
    return this.userService.findUserProfilePhotoForUser(req.user.userId);
  }

  /**
   * updateUserProfileImage
   *
   * @returns - updated user object with password ommitted.
   */
  @ApiTags(AppConstants.API_TAG)
  @ApiResponse({
    status: 201,
    description: AppConstants.UPDATE_USER_PROFILE_IMAGE_DESC,
  })
  @ApiOperation({ summary: AppConstants.UPDATE_USER_PROFILE_IMAGE_DESC })
  @Post(AppConstants.UPDATE_USER_PROFILE_IMAGE)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = path.extname(file.originalname);
          const newFileName = file.fieldname + '-' + uniqueSuffix + extension;
          Logger.log('filename interceptor renaming file to:' + newFileName);
          if (!extension.match(/\.(jpg|jpeg|png|JPEG|JPG)$/)) {
            cb(
              new Error(
                'jpg|jpeg|png|JPG|JPEG are the only allowed file types.',
              ),
              newFileName,
            );
          }
          cb(null, newFileName);
        },
      }),
    }),
  )
  async updateUserProfileImage(
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 15000000 }), //15mb max size
        ],
      }),
    )
    file: any,
  ) {
    Logger.log('here is req user id:'+req.user.userId);
    const user = await this.userService.updateUserProfileImage(req.user.userId ,file.filename);
  }
}
   