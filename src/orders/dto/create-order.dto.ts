import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsArray,
  IsBoolean,
  ValidateNested,
  IsCreditCard,
} from 'class-validator';
import { Type } from 'class-transformer';

class ShippingDetailsDto {
  @IsNotEmpty({ message: 'Street is required' })
  @IsString({ message: 'Street must be a string' })
  street: string;

  @IsCreditCard({ message: 'Invalid card number' })
  @IsNotEmpty({ message: 'Card number is required' })
  cardNumber: string;
}

class PersonalDetailsDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsPhoneNumber(null, { message: 'Invalid phone number' })
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;
}

export class CreateOrderDto {
  @IsArray({ message: 'Product IDs must be an array' })
  @IsNotEmpty({ each: true, message: 'Product ID is required' })
  productIds: number[];

  @ValidateNested({ message: 'Invalid shipping details' })
  @Type(() => ShippingDetailsDto)
  shippingDetails: ShippingDetailsDto;

  @ValidateNested({ message: 'Invalid personal details' })
  @Type(() => PersonalDetailsDto)
  personalDetails: PersonalDetailsDto;

  @IsBoolean({ message: 'isApproved must be a boolean value' })
  isApproved?: boolean;
}
