import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsBoolean, IsEmail, IsInt, IsDate, IsOptional } from 'class-validator';

export class FindUserDto {
  // @Optional()
  // @IsInt()
  @ApiPropertyOptional({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional({ type: Date })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @IsOptional()
  updatedSince?: Date;

  @ApiPropertyOptional({ type: [Number] })
  @Transform((obj) =>
    String(obj.value)
      .trim()
      .split(',')
      .map((x: string) => Number(x)),
  )
  @IsOptional()
  id?: number[];

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ type: Boolean })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  credentials?: boolean;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ type: Boolean })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  show_deleted?: boolean;
}
