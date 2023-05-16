import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  getSchemaPath,
  ApiOperation,
} from '@nestjs/swagger';
import { AppConstants } from '../../app.constants';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserRoleService } from './user-role.service';
import { UserRoleRef } from '../entities';

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
}
