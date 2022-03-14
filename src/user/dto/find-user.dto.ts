import { Optional } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsArray, IsBoolean, IsEmail, IsInt, IsDate, isDate } from 'class-validator';

export class FindUserDto {
  // @Optional()
  // @IsInt()
  @Type(() => Number)
  limit?: number;

  // @IsInt()
  @Type(() => Number)
  offset?: number;

  @Optional()
  @Type(() => Date)
  @IsDate()
  updatedSince?: Date;

  // @IsInt({ each: true })
  // // @Type(() => Number)
  // @Transform((value: string[]) => value.split(','))
  // @IsArray()
  id?: number[];

  @Optional()
  name?: string;

  @Type(() => Boolean)
  credentials?: boolean;

  email?: string;
}
