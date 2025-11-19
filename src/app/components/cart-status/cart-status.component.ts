import { Component } from '@angular/core';
import { CartServiceService } from '../../services/cart-service.service';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-cart-status',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.css'
})
export class CartStatusComponent {
  totalPrice: string = '0.00';
  totalQuantity: number = 0;

  constructor(private cartService: CartServiceService) { }

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus(): void {
    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data.toFixed(2)
    );

    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

}
