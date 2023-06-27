import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity('chat')
export class Chat extends CommonEntity {
  @ApiProperty({
    description: 'The name of the chat conversation.  This does not have to be unique.',
  })
  @Column({ type: 'varchar', length: 64 })
  public name!: string;
}
