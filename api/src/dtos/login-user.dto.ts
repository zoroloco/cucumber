import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ required: true, description: 'This field must be a valid email address. Max 32 chars.' })
  @MaxLength(32)
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ required: true, description: 'This is the user password.' })
  @MaxLength(32)
  @IsNotEmpty()
  readonly password: string;
}
