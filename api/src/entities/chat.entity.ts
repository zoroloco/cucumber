import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity, ChatUser, ChatMessage } from '.';

@Entity('chat')
export class Chat extends CommonEntity {
  @ApiProperty({
    description:
      'The name of the chat conversation.  This does not have to be unique.',
  })
  @Column({ type: 'varchar', length: 64 })
  public name!: string;

  @ApiProperty({
    description: 'Bit if set to 1=chat is public. 0=chat is private.',
  })
  @Column({ name: 'public', type: 'boolean', default: false })
  public public: boolean;

  @ApiProperty({
    description: 'List of users associated to this chat.',
  })
  @OneToMany(() => ChatUser, (chatUser) => chatUser.chat)
  chatUsers: ChatUser[];
}
