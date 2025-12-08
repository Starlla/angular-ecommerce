import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {

  cartItems: any[] = [];
  storage: Storage | undefined;
  private isBrowser = typeof window !== 'undefined';

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);


  constructor() {
    // Initialize storage only in browser environment
    if (this.isBrowser) {
      this.storage = sessionStorage;
    }

    // Load cart items from sessionStorage only in browser
    if (this.isBrowser) {
      try {
        let data = sessionStorage.getItem('cartItems');
        if (data != null) {
          this.cartItems = JSON.parse(data);
          this.computeCartTotals();
        }
      } catch (error) {
        console.error('Error loading cart items:', error);
        this.cartItems = [];
      }
    }
  }

  persistCartItems() {
    if (this.isBrowser && this.storage) {
      this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
    }
  }

  addToCart(theCartItem: any): void {
    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: any = undefined;

    existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

    alreadyExistsInCart = (existingCartItem != undefined);

    if (alreadyExistsInCart) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();

  }

  decrementQuantity(theCartItem: any): void {
    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: any): void {
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);

    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

  computeCartTotals(): void {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    this.persistCartItems();
  }
}
