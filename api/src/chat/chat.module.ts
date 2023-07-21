import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat, ChatUser, ChatMessage, User } from '../entities';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ImageProcessingModule } from '../image-processing';

@Module({
  imports: [
    ImageProcessingModule,
    TypeOrmModule.forFeature(
      [User, Chat, ChatMessage, ChatUser],
      'druidia',
    ),
  ],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
