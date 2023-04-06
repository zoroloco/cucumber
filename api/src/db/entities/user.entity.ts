import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Unique } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity('user')
export class User extends CommonEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 32 })
  public username!: string;

  @Column({ type: 'varchar', length: 128 })
  public password!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  public firstName!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  public lastName!: string;
}
