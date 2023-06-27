import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity('user_profile')
export class UserProfile extends CommonEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 64 })
  public profilePhotoPath!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 40 })
  public firstName!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 40 })
  public middleName!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 40 })
  public lastName!: string;
}
