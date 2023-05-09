import {
  Controller,
  Param,
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
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  getSchemaPath,
} from '@nestjs/swagger';
import { AppConstants } from '../../app.constants';
import { SearchUserDto, CreateUserDto, CreateUserAssociationDto } from '../../dtos';
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
          lastName: 'Jingleheimer',
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
  @UseGuards(JwtAuthGuard)
  @Get(AppConstants.FIND_ALL_USERS)
  @ApiTags(AppConstants.API_TAG)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: AppConstants.FIND_ALL_USERS_DESC,
    type: [User],
  })
  @ApiOperation({ summary: AppConstants.FIND_ALL_USERS_DESC })
  findAllUsers() {
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
    status: 201,
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
  @ApiBody({
    type: SearchUserDto,
    examples: {
      example: {
        value: {
          username: 'NA',
          firstName: 'NA',
          lastName: 'NA',
          query: 'john@doe.org',
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
      searchUserDto.query,
    );
  }

  /**
   * findUserAssociationsByUserId
   *
   * @param id - id of the user
   * @returns - list of user associates for given user id
   */
  @UseGuards(JwtAuthGuard)
  @ApiTags(AppConstants.API_TAG)
  @ApiResponse({
    status: 200,
    description: AppConstants.FIND_USER_ASSOCIATIONS_BY_USER_DESC,
  })
  @ApiOperation({ summary: AppConstants.FIND_USER_ASSOCIATIONS_BY_USER_DESC })
  @ApiBearerAuth()
  @Get(AppConstants.FIND_USER_ASSOCIATIONS_BY_USER)
  async findUserAssociationsByUserId(@Param('userid') userId: number) {
    return this.userService.findUserAssociationsByUserId(userId);
  }

  /**
   * createUserAssociation
   *
   * @param createUserAssocationDto
   * @returns - creates friends. :)
   */
  @ApiTags(AppConstants.API_TAG)
  @ApiBody({
    type: CreateUserAssociationDto,
    examples: {
      example: {
        value: {
          userId: '1',
          associateUserId:'2'
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: AppConstants.CREATE_USER_ASSOCIATION_DESC,
    type: CreateUserAssociationDto,
  })
  @ApiOperation({ summary: AppConstants.CREATE_USER_ASSOCIATION_DESC })
  @Post(AppConstants.CREATE_USER_ASSOCIATION)
  async createUserAssociation(
    @Body() createUserAssociationDto: CreateUserAssociationDto,
  ) {
    return await this.userService.createUserAssocation(
      createUserAssociationDto.userId,
      createUserAssociationDto.associateUserId,
    );
  }
}
