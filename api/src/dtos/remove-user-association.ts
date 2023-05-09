import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class RemoveUserAssociationDto {

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
    description: 'ID of the user that will be de-associated.',
  })
  readonly associateUserId: number;
}
