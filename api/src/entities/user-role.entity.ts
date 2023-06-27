import { ApiProperty } from '@nestjs/swagger';
import { ManyToOne, Entity, JoinColumn } from 'typeorm';
import { User, UserRoleRef } from '.';
import { CommonEntity } from './common.entity';

/**
 * Defines user roles per user.
 */

@Entity('user_role')
export class UserRole extends CommonEntity {
  
  @ApiProperty({description: 'The user context.'})
  @ManyToOne(() => User)
  @JoinColumn({name:'userId'})
  user: User;

  @ApiProperty({description: 'The user role assigned for this user.'})
  @ManyToOne(() => UserRoleRef)
  @JoinColumn({name:'userRoleRefId'})
  userRoleRef: UserRoleRef;
}
