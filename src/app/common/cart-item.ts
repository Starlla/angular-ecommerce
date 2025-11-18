export class CartItem {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;

  constructor(product: any) {
    this.id = product.id;
    this.name = product.name;
    this.unitPrice = product.unitPrice;
    this.quantity = 1;
  }
}
