import { ApiProperty } from '@nestjs/swagger';
import { ManyToOne, Entity, JoinColumn } from 'typeorm';
import { User, Chat } from '.';
import { CommonEntity } from './common.entity';

/**
 * Defines the relationship between a user and their chats.
 */

@Entity('user_chat')
export class UserChat extends CommonEntity {
  
  @ApiProperty({description: 'The user context.'})
  @ManyToOne(() => User)
  @JoinColumn({name:'userId'})
  user: User;

  @ApiProperty({description: 'The chat context.'})
  @ManyToOne(() => Chat)
  @JoinColumn({name:'chatId'})
  chat: Chat;
}
