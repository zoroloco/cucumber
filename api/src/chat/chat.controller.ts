import {
  Controller,
  Param,
  Get,
  Post,
  Request,
  UseGuards,
  Body,
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
import { CreateChatDto } from '../dtos';
import { ChatService } from './chat.service';
import { Chat } from '../entities';

@Controller(AppConstants.API_PATH)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * createChat
   *
   * @param req
   * @param createChatDto
   * @returns
   */
  @UseGuards(JwtAuthGuard, AuthUserRoleGuard)
  @ApiTags(AppConstants.API_TAG)
  @ApiBody({
    type: CreateChatDto,
    examples: {
      example: {
        value: {
          name: 'my chat room',
          publicFlag: 1,
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
      createChatDto.userIds,
      createChatDto.publicFlag,
    );
  }

  /**
   * findAllChatsByUserId
   *
   * @param string
   * @returns - all chats associated to the user given the user id.
   */
  @UseGuards(JwtAuthGuard, AuthUserRoleGuard)
  @Get(AppConstants.FIND_ALL_CHATS_BY_USER)
  @ApiBearerAuth()
  @ApiTags(AppConstants.API_TAG)
  @ApiResponse({
    status: 201,
    description: AppConstants.FIND_ALL_CHATS_BY_USER_DESC,
  })
  @ApiOperation({ summary: AppConstants.FIND_ALL_CHATS_BY_USER_DESC})
  async findAllChatsByUserId(@Param('userid') userId: number) {
    return this.chatService.findAllChatsByUserId(userId);
  }
}
