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
import { CreateChatDto, CreateChatMessageDto } from '../dtos';
import { ChatService } from './chat.service';
import { Chat, ChatMessage } from '../entities';

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
  async createChat(
    @Request() req,
    @Body() createChatDto: CreateChatDto,
  ) {
    return await this.chatService.createChat(
      req.user.userId,
      createChatDto.name,
      createChatDto.userIds,
      createChatDto.publicFlag,
    );
  }

  /**
   * findChatsForUser
   *
   * @param string
   * @returns - all chats associated to the user.
   */
  @UseGuards(JwtAuthGuard, AuthUserRoleGuard)
  @Get(AppConstants.FIND_CHATS_FOR_USER)
  @ApiBearerAuth()
  @ApiTags(AppConstants.API_TAG)
  @ApiResponse({
    status: 201,
    description: AppConstants.FIND_CHATS_FOR_USER_DESC,
  })
  @ApiOperation({ summary: AppConstants.FIND_CHATS_FOR_USER_DESC })
  async findChatsForUser(@Request() req) {
    return this.chatService.findChatsForUser(req.user.userId);
  }

  /**
   * createChatMessage
   *
   * @param req
   * @param createChatMessageDto
   * @returns
   */
  @UseGuards(JwtAuthGuard, AuthUserRoleGuard)
  @ApiTags(AppConstants.API_TAG)
  @ApiBody({
    type: CreateChatMessageDto,
    examples: {
      example: {
        value: {
          content: 'Hello ASL? WTF?',
          chatId: 2,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: AppConstants.CREATE_CHAT_MESSAGE_DESC,
    type: ChatMessage,
  })
  @ApiOperation({ summary: AppConstants.CREATE_CHAT_MESSAGE_DESC })
  @ApiBearerAuth()
  @Post(AppConstants.CREATE_CHAT_MESSAGE)
  async createChatMessage(
    @Request() req,
    @Body() createChatMessageDto: CreateChatMessageDto,
  ) {
    return await this.chatService.createChatMessage(
      req.user.userId,
      createChatMessageDto.chatId,
      createChatMessageDto.content,
    );
  }

  /**
   * findAllChatMessagesByChatId
   *
   * @param string
   * @returns - all chat messages associated to the request user id and given chat id.
   */
  @UseGuards(JwtAuthGuard, AuthUserRoleGuard)
  @Get(AppConstants.FIND_CHAT_MESSAGES_BY_CHAT)
  @ApiBearerAuth()
  @ApiTags(AppConstants.API_TAG)
  @ApiResponse({
    status: 201,
    description: AppConstants.FIND_CHAT_MESSAGES_BY_CHAT_DESC,
  })
  @ApiOperation({ summary: AppConstants.FIND_CHAT_MESSAGES_BY_CHAT_DESC })
  async findAllChatMessagesByChatId(
    @Request() req,
    @Param('chatid') chatId: number,
  ) {
    return this.chatService.findAllChatMessagesByChatId(req.userId, chatId);
  }
}
