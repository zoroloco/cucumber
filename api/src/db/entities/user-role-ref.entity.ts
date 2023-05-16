import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { CommonEntity } from './common.entity';

/**
 * Reference table holding all user roles for this web application.
 */

@Entity('user_role_ref')
export class UserRoleRef extends CommonEntity {
  @ApiProperty({ description: 'Name of the user role' })
  @Column({ type: 'varchar', length: 32, unique: true })
  public roleName!: string;

  @ApiProperty({ description: 'Human friendly name of the user role' })
  @Column({ type: 'varchar', length: 32, unique: true })
  public roleLabel!: string;

  @ApiProperty({ description: 'A brief description of the user role.' })
  @Column({ type: 'varchar', length: 128 })
  public roleDescription!: string;
}
