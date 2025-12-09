import { Address } from './address';
import { Customer } from './customer';

export class OrderHistory {
  constructor(
    public orderTrackingNumber: string,
    public totalQuantity: number,
    public totalPrice: number,
    public status: string | null,
    public dateCreated: Date,
    public lastUpdated: Date,
    public orderItems: OrderItem[],
    public customer: Customer,
    public shippingAddress: Address,
    public billingAddress: Address,
    public _links?: any
  ) { }
}

export class OrderItem {
  constructor(
    public imageUrl: string,
    public unitPrice: number,
    public quantity: number,
    public productId: number,
    public _links?: any
  ) { }
}