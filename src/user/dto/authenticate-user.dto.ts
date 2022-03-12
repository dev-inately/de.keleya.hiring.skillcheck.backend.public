import { IsEmail, IsNotEmpty, Min, Max, IsString, MinLength, MaxLength } from 'class-validator';

export class AuthenticateUserDto {
  @MaxLength(60)
  @MinLength(6)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
