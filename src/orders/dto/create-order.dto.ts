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
  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsCreditCard()
  cardNumber: string;
}

class PersonalDetailsDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber(null)
  phone: string;
}

export class CreateOrderDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  productIds: number[];

  @ValidateNested()
  @Type(() => ShippingDetailsDto)
  shippingDetails: ShippingDetailsDto;

  @ValidateNested()
  @Type(() => PersonalDetailsDto)
  personalDetails: PersonalDetailsDto;

  @IsBoolean()
  isApproved?: boolean;
}
