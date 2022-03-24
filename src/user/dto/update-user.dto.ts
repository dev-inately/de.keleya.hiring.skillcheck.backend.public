import { PartialType, OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsInt } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

/**
 * I intentionally omitted the email field as that seems like a unique constrainst that shouldn't
 * be changed in real life situations (well, atleast without a form of verification). Also a user
 * shouldn't be able to change their role
 */

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['email'] as const)) {
  @ApiPropertyOptional({ type: Number, default: 1 })
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
