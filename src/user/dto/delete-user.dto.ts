import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
