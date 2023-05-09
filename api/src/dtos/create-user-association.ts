import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateUserAssociationDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
    description: 'ID of the user context.',
  })
  readonly userId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
    description: 'ID of the user that will be associated.',
  })
  readonly associateUserId: number;
}
