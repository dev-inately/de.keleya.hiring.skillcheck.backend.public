import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsBoolean, IsInt } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

/**
 * I intentionally omitted the email field as that seems like a unique constrainst that shouldn't
 * be changed in real life situations (well, atleast without a form of verification)
 */

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['email'] as const)) {
  @IsBoolean()
  email_verified?: boolean;

  @IsBoolean()
  is_admin?: boolean;

  @IsNotEmpty()
  @IsInt()
  id: number;
}
