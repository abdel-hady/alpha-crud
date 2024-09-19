export class CreateOrderDto {
  productIds: number[]; // List of product IDs for the order
  shippingDetails: {
    street: string;
    cardNumber: string;
    extraInfo1: string;
    extraInfo2: string;
  };
  personalDetails: {
    name: string;
    email: string;
    phone: string;
    extraInfo1: string;
    extraInfo2: string;
  };
  isApproved?: boolean; // Optional, since approval happens later
}
