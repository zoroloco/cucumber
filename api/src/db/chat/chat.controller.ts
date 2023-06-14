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
import { CreateChatDto } from '../../dtos';
import { ChatService } from './chat.service';
import { Chat } from '../entities';

@Controller(AppConstants.API_PATH)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
  ) {}

  /**
   * createChat
   *
   * @param req
   * @param createChatDto
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @ApiTags(AppConstants.API_TAG)
  @ApiBody({
    type: CreateChatDto,
    examples: {
      example: {
        value: {
          name: 'my chat room',
          userIds: [3, 2, 44, 921, 64, 322],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: AppConstants.CREATE_CHAT_DESC,
    type: Chat,
  })
  @ApiOperation({ summary: AppConstants.CREATE_CHAT_DESC })
  @ApiBearerAuth()
  @Post(AppConstants.CREATE_CHAT)
  async removeUserAssociation(
    @Request() req,
    @Body() createChatDto: CreateChatDto,
  ) {
    return await this.chatService.createUserChat(
      req.user.userId,
      createChatDto.name,
      createChatDto.userIds
    );
  }
}
