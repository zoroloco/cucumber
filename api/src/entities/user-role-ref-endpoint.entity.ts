import { ApiProperty } from '@nestjs/swagger';
import { ManyToOne, Entity, JoinColumn, Column } from 'typeorm';
import { UserRoleRef } from '.';
import { CommonEntity } from './common.entity';

/**
 * Defines endpoints and user role ref relationship.  This is used to define what user roles allow
 * access to different REST endpoints.
 */

@Entity('user_role_ref_endpoint')
export class UserRoleRefEndpoint extends CommonEntity {
  
  @ApiProperty({description: 'The REST endpoint path'})
  @Column({ type: 'varchar', length: 128 })
  public endPoint!: string;

  @ApiProperty({description: 'The user role ref assigned for this user.'})
  @ManyToOne(() => UserRoleRef)
  @JoinColumn({name:'userRoleRefId'})
  userRoleRef: UserRoleRef;
}
