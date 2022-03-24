import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @MaxLength(60)
  @MinLength(6)
  @IsEmail()
  @IsNotEmpty()
  email: string;
  // // I am of the opinion that admin users should be seeded, so a user should not be able to pass this
  // @IsBoolean()
  // is_admin = false;
  @ApiProperty()
  @MaxLength(40)
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
