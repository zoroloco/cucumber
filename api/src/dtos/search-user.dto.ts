import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class SearchUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(32)
  readonly username: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(40)
  readonly lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(40)
  readonly firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(40)
  readonly query: string;
}
