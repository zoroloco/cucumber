import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    required: true,
    description: '32 char max. Must be a valid email format.',
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(32)
  readonly username: string;

  @ApiProperty({ required: true, description: '32 char max' })
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(32)
  readonly password: string;

  @ApiProperty({ description: '40 char max' })
  @MaxLength(40)
  readonly firstName: string;

  @ApiProperty({ description: '40 char max' })
  @MaxLength(40)
  readonly middleName: string;

  @ApiProperty({ description: '40 char max' })
  @MaxLength(40)
  readonly lastName: string;
}
