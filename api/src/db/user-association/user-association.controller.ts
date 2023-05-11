import {
  Controller,
  Param,
  Get,
  Post,
  Request,
  UseGuards,
  Body,
  Logger,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { AppConstants } from '../../app.constants';
import { CreateUserAssociationDto } from '../../dtos';
import { UserAssociationService } from './user-association.service';
import { RemoveUserAssociationDto } from '../../dtos/remove-user-association';

@Controller(AppConstants.API_PATH)
export class UserAssociationController {
  constructor(
    private readonly userAssociationService: UserAssociationService,
  ) {}

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
    return this.userAssociationService.findUserAssociationsByUserId(userId);
  }

  /**
   * createUserAssociation
   *
   * @param createUserAssocationDto
   * @returns - creates friends. :)
   */
  @UseGuards(JwtAuthGuard)
  @ApiTags(AppConstants.API_TAG)
  @ApiBody({
    type: CreateUserAssociationDto,
    examples: {
      example: {
        value: {
          userId: 1,
          associateUserId: 2,
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
  @ApiBearerAuth()
  @Post(AppConstants.CREATE_USER_ASSOCIATION)
  async createUserAssociation(
    @Body() createUserAssociationDto: CreateUserAssociationDto,
  ) {
    return await this.userAssociationService.createUserAssocation(
      createUserAssociationDto.userId,
      createUserAssociationDto.associateUserId,
    );
  }

  /**
   * removeUserAssociation
   * 
   * @param req 
   * @param removeUserAssociationDto 
   * @returns 
   */
  @UseGuards(JwtAuthGuard)
  @ApiTags(AppConstants.API_TAG)
  @ApiBody({
    type: RemoveUserAssociationDto,
    examples: {
      example: {
        value: {
          userId: 1,
          associateUserId: 2,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: AppConstants.REMOVE_USER_ASSOCIATION_DESC,
    type: RemoveUserAssociationDto,
  })
  @ApiOperation({ summary: AppConstants.REMOVE_USER_ASSOCIATION_DESC })
  @ApiBearerAuth()
  @Post(AppConstants.REMOVE_USER_ASSOCIATION)
  async removeUserAssociation(
    @Request() req,
    @Body() removeUserAssociationDto: RemoveUserAssociationDto,
  ) {
    Logger.log('here is user:' + JSON.stringify(req.user));
    return await this.userAssociationService.removeUserAssociation(
      '',
      removeUserAssociationDto.userId,
      removeUserAssociationDto.associateUserId,
    );
  }
}
