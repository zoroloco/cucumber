import { Controller, Param, Body, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AppConstants } from '../../app.constants';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserRoleService } from './user-role.service';
import { SearchUserDto } from '../../dtos';

@Controller(AppConstants.API_PATH)
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}
  /**
   * findUserRoleRefsByUserId
   *
   * @param string
   * @returns - List of user role refs matching given user id.
   */
  @UseGuards(JwtAuthGuard)
  @Post(AppConstants.FIND_USER_ROLE_REFS_BY_USER)
  @ApiBearerAuth()
  @ApiTags(AppConstants.API_TAG)
  @ApiResponse({
    status: 201,
    description: AppConstants.FIND_USER_ROLE_REFS_BY_USER_DESC,
  })
  @ApiOperation({ summary: AppConstants.FIND_USER_ROLE_REFS_BY_USER_DESC })
  async findUserRoleRefsByUserId(@Param('userid') userId: number) {
    return this.userRoleService.findAllByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(AppConstants.FIND_ALL_USER_ROLE_REFS)
  @ApiBearerAuth()
  @ApiTags(AppConstants.API_TAG)
  @ApiResponse({
    status: 200,
    description: AppConstants.FIND_ALL_USER_ROLE_REFS_DESC
  })
  @ApiOperation({summary: AppConstants.FIND_ALL_USER_ROLE_REFS_DESC})
  async findAllUserRoleRefs(){
    return this.userRoleService.findAllUserRoleRefs();
  }

    /**
   * findAllUsersHeavyBySearchParams
   *
   * @returns - All users roles matching search params for the user.
   */
    @UseGuards(JwtAuthGuard)
    @Post(AppConstants.FIND_ALL_USER_ROLES_HEAVY_BY_SEARCH_PARAMS)
    @ApiTags(AppConstants.API_TAG)
    @ApiBearerAuth()
    @ApiResponse({
      status: 201,
      description: AppConstants.FIND_ALL_USER_ROLES_HEAVY_BY_SEARCH_PARAMS_DESC
    })
    @ApiOperation({ summary: AppConstants.FIND_ALL_USER_ROLES_HEAVY_BY_SEARCH_PARAMS_DESC })
    findAllUserRolesHeavyBySearchParams(@Body() searchUserDto: SearchUserDto) {
      return this.userRoleService.findAllUserRolesHeavyBySearchParams(searchUserDto.searchQuery);
    }
}