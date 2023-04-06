import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SearchUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  username: string;
}
