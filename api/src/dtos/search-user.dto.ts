import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class SearchUserDto {
  @ApiProperty({description: 'Query string to search for a user. Min 3 chars. Max 40 chars.'})
  @MaxLength(40)
  readonly searchQuery: string;
}
