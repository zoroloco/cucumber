import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from './common.entity';
import { User } from '.';

@Entity('message')
export class Message extends CommonEntity {
  
  @ApiProperty({description: 'The user context that created the message.'})
  @ManyToOne(() => User)
  @JoinColumn({name:'userId'})
  user: User;

  @ApiProperty({
    description: 'The actual chat message.',
  })
  @Column({ type: 'varchar', length: 2048 })
  public message!: string;
}
