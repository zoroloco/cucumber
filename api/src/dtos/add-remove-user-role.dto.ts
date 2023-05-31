import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddRemoveUserRoleDto {
  @ApiProperty({
    required: true,
    description: 'The ID of the user that will have their user role added or removed.',
  })
  @IsNotEmpty()
  readonly userId: number;

  @ApiProperty({
    required: true,
    description: 'The ID of the user role ref to add or remove from the user.',
  })
  @IsNotEmpty()
  readonly userRoleRefId: number;
}
