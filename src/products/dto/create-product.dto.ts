import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(100, { message: 'Name is too long' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Type is required' })
  @MaxLength(50, { message: 'Type is too long' })
  type: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Description is too long' })
  description?: string;
}
