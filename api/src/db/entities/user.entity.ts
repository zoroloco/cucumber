import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from './common.entity';
import { UserProfile } from '../entities';

@Entity('user')
export class User extends CommonEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 32, unique: true })
  public username!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 128 })
  public password!: string; //This is saved as a hash.

  @ApiProperty()
  @Column({ type: 'timestamp' })
  public lastLoginTime!: Date;

  @OneToOne(() => UserProfile)
  @JoinColumn()
  userProfile: UserProfile;
}
