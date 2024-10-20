import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Name is too long' })
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'Type is too long' })
  type?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Description is too long' })
  description?: string;
}
