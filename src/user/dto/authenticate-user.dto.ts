import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class AuthenticateUserDto {
  @ApiProperty({ example: 'officialwebdev@gmail.com' })
  @MaxLength(60)
  @MinLength(6)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'thisis!secure' })
  @MaxLength(60)
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  password: string;
}
