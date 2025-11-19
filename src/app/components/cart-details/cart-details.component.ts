import { Component } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartServiceService } from '../../services/cart-service.service';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart-details',
  standalone: true,
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent {
  cartItems: CartItem[] = [];
  totalPrcie: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartServiceService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails(): void {
    // get a handle to the cart items
    this.cartItems = this.cartService.cartItems;

    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrcie = data
    );

    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    // compute cart total price and total quantity
    this.cartService.computeCartTotals();
  }

}
