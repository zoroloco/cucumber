import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, IsNumber } from 'class-validator';

export class CreateChatMessageDto {
  @IsNotEmpty()
  @MaxLength(2048)
  @ApiProperty({
    description:
      'The text content this chat message. 2048 max characters.',
  })
  readonly content: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
    description: 'ID of the chat that will own this message.',
  })
  readonly chatId: number;
}
