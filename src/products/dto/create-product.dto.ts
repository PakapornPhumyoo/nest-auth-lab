import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  colors?: string[];
}
