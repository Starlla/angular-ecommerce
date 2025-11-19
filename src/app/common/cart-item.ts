export class CartItem {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string = '';

  constructor(product: any) {
    this.id = product.id;
    this.name = product.name;
    this.unitPrice = product.unitPrice;
    this.quantity = 1;
    this.imageUrl = product.imageUrl;
  }
}
