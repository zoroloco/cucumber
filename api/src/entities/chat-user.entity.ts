import { ApiProperty } from '@nestjs/swagger';
import { ManyToOne, Entity, JoinColumn } from 'typeorm';
import { User, Chat } from '.';
import { CommonEntity } from './common.entity';

/**
 * Defines the relationship between users and a chat.
 */

@Entity('chat_user')
export class ChatUser extends CommonEntity {
  @ApiProperty({ description: 'The user context.' })
  @ManyToOne(() => User, {lazy: true})
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: 'The chat context.' })
  @ManyToOne(() => Chat, (chat) => chat.chatUsers)
  @JoinColumn({ name: 'chatId' })
  chat: Chat;
}
