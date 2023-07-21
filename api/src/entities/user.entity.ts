import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { CommonEntity, UserProfile } from '.';

@Entity('user')
export class User extends CommonEntity {
  @ApiProperty({
    description: 'Valid email format no more than 32 chars long.',
  })
  @Column({ type: 'varchar', length: 32, unique: true })
  public username!: string;

  @ApiProperty({ description: 'Blank on any responses for security.' })
  @Column({ type: 'varchar', length: 128 })
  public password!: string; //This is saved as a hash.

  @ApiProperty({
    description: 'The last time the user logged in to the application.',
  })
  @Column({ type: 'timestamp' })
  public lastLoginTime!: Date;

  @OneToOne(() => UserProfile, { lazy: true })
  @JoinColumn({ name: 'userProfileId' })
  userProfile: UserProfile;

  //Transient property
  @ApiProperty({ description: 'Base64 encoded string with the profile photo.' })
  profilePhotoFile: string;
}
