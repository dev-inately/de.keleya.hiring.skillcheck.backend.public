import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class FindUserDto {
  limit?: number;
  offset?: number;
  updatedSince?: number;

  //   @IsNotEmpty()
  //   @IsArray()
  //   @IsString({ each: true })
  //   @Type(() => String)
  //   @Transform((value: string[]) => value.split(','))
  id?: string[];

  name?: string;
  credentials?: boolean;
  email?: string;
}
