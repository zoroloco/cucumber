import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  MaxLength,
  IsAlphanumeric,
} from 'class-validator';

export class CreateChatDto {
  @MaxLength(64)
  @ApiProperty({
    description:
      'The name of the chat conversation. This does not have to be unique.',
  })
  readonly name: string;

  @ApiProperty({
    description: 'Bit if set to 1=chat is public. 0=chat is private.',
  })
  readonly publicFlag: boolean;

  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: 'List of user ids that are part of the conversation.',
  })
  readonly userIds: Array<number>;
}
