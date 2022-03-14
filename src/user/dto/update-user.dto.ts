import { PartialType, OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsInt } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

/**
 * I intentionally omitted the email field as that seems like a unique constrainst that shouldn't
 * be changed in real life situations (well, atleast without a form of verification)
 */

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['email', 'is_admin'] as const)) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
