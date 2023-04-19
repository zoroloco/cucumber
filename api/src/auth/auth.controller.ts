import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppConstants } from '../app.constants';
import { JwtAuthGuard } from './jwt-auth.guard';

/**
 * 
 * This method is used by the client to test if the 
 * header's bearer token is valid.
 */
@Controller(AppConstants.API_PATH)
export class AuthController {
  @UseGuards(JwtAuthGuard)
  @Get(AppConstants.VALIDATE_TOKEN)
  @ApiBearerAuth()
  @ApiTags(AppConstants.API_TAG)
  @ApiResponse({
    description: AppConstants.VALIDATE_TOKEN_DESC,
  })
  @ApiOperation({ summary: AppConstants.VALIDATE_TOKEN_DESC })
  async validateToken() {
    return HttpStatus.OK;
  }
}
