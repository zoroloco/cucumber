import { ApiProperty } from '@nestjs/swagger';
import { Column, ManyToOne, Entity, JoinColumn } from 'typeorm';
import { User, Chat } from '.';
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

  @ApiProperty({description: 'The user context that created the message.'})
  @ManyToOne(() => User)
  @JoinColumn({name:'userId'})
  user: User;

  @ApiProperty({
    description: 'The actual chat message content.',
  })
  @Column({ type: 'varchar', length: 2048 })
  public content!: string;
}
