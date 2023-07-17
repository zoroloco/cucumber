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
import { JwtAuthGuard, AuthUserRoleGuard } from '../auth';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { AppConstants } from '../app.constants';
import { RedisService } from './redis.service';

@Controller(AppConstants.API_PATH)
export class AppCacheController {
  constructor(private readonly redisService: RedisService) {}

  /**
   * 
   * @returns all the cached user role refs in the application.
   */
  @UseGuards(JwtAuthGuard, AuthUserRoleGuard)
  @Get(AppConstants.FIND_ALL_CACHED_USER_ROLE_REFS)
  @ApiBearerAuth()
  @ApiTags(AppConstants.API_TAG)
  @ApiResponse({
    status: 200,
    description: AppConstants.FIND_ALL_CACHED_USER_ROLE_REFS_DESC,
  })
  @ApiOperation({ summary: AppConstants.FIND_ALL_CACHED_USER_ROLE_REFS_DESC })
  async findAllUserRoleRefs() {
    return this.redisService.fetchCachedData(AppConstants.APP_CACHE_USER_ROLE_REFS);
  }

  /**
   * 
   * @returns all the cached user role ref endpoints in the application.
   */
    @UseGuards(JwtAuthGuard, AuthUserRoleGuard)
    @Get(AppConstants.FIND_ALL_CACHED_USER_ROLE_REF_ENDPOINTS)
    @ApiBearerAuth()
    @ApiTags(AppConstants.API_TAG)
    @ApiResponse({
      status: 200,
      description: AppConstants.FIND_ALL_CACHED_USER_ROLE_REF_ENDPOINTS_DESC,
    })
    @ApiOperation({ summary: AppConstants.FIND_ALL_CACHED_USER_ROLE_REF_ENDPOINTS_DESC })
    async findAllUserRoleRefEndpoints() {
      return this.redisService.fetchCachedData(AppConstants.APP_CACHE_USER_ROLE_REF_ENDPOINTS);
    }
}
