import { ApiProperty } from '@nestjs/swagger';
import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from './common.entity';
import { User } from '.';

@Entity('user_association')
export class UserAssociation extends CommonEntity {

  @ApiProperty({description: 'The user context.'})
  @ManyToOne(() => User)
  @JoinColumn({name:'userId'})
  user: User;

  @ApiProperty({description: 'The associated user context.'})
  @ManyToOne(() => User)
  @JoinColumn({name:'associateUserId'})
  associate: User;

}
