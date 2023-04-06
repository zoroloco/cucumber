import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto{
    @ApiProperty({ required: true })
    @IsEmail()
    @IsNotEmpty()
    username: string;
  
    @ApiProperty({ required: true })
    @IsNotEmpty()
    password: string;
}