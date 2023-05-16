import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class SearchUserDto {
  @ApiProperty({description: 'Username to search by. Max 32 chars.'})
  @IsNotEmpty()
  @MaxLength(32)
  readonly username: string;

  @ApiProperty({description: 'Last name of user to search by. Max 40 chars.'})
  @IsNotEmpty()
  @MaxLength(40)
  readonly lastName: string;

  @ApiProperty({description: 'First name of user to search by. Max 40 chars'})
  @IsNotEmpty()
  @MaxLength(40)
  readonly firstName: string;

  @ApiProperty({description: 'Query string to match user first, last name or user name. Min 3 chars. Max 40 chars.'})
  @IsNotEmpty()
  @MaxLength(40)
  readonly query: string;
}
