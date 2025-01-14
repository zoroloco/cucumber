import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppConstants } from '../app.constants';
import { AuthUserRoleGuard, JwtAuthGuard } from '../auth';

@Controller(AppConstants.API_PATH)
export class NflController {
  //constructor(private readonly rapidApiService: RapidApiService) {}

  @UseGuards(JwtAuthGuard, AuthUserRoleGuard)
  @Get('find-all-teams')
  @ApiTags(AppConstants.NFL_TAG)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Returns details on all NFL teams.',
    //type: [User],
  })
  @ApiOperation({ summary: 'Returns details on all NFL teams' })
  findAllUsers() {
    //return this.userService.findAll();
    return [];
  }
}
