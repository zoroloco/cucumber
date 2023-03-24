import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn() id!: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  public firstName!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  public lastName!: string;
}
