import { ApiProperty } from '@nestjs/swagger';
import { ManyToOne, Entity, JoinColumn } from 'typeorm';
import { Message, Chat } from '.';
import { CommonEntity } from './common.entity';

/**
 * Defines the relationship between a chat and its messages.
 */

@Entity('chat_message')
export class ChatMessage extends CommonEntity {
  
  @ApiProperty({description: 'The chat context.'})
  @ManyToOne(() => Chat)
  @JoinColumn({name:'chatId'})
  chat: Chat;

  @ApiProperty({description: 'The message context.'})
  @ManyToOne(() => Message)
  @JoinColumn({name:'messageId'})
  message: Message;
}
