import { IsEmail, IsNotEmpty, IsBoolean, IsString, MinLength, MaxLength } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @MaxLength(60)
  @MinLength(6)
  @IsEmail()
  @IsNotEmpty()
  email: string;
  // I am of the opinion that admin users should be seeded, but yeah, let's be flexible
  @IsBoolean()
  is_admin = false;

  @MaxLength(40)
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
