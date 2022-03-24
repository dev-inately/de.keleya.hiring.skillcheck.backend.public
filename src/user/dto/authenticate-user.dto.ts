import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class AuthenticateUserDto {
  @ApiProperty()
  @MaxLength(60)
  @MinLength(6)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @MaxLength(60)
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  password: string;
}
