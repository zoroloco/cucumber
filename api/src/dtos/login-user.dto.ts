import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ required: true })
  @MaxLength(32)
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ required: true })
  @MaxLength(32)
  @IsNotEmpty()
  readonly password: string;
}
