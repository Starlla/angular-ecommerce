import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private baseUrl = 'http://localhost:8080/api/checkout/purchase';

  constructor(private httpClient: HttpClient) {
  }

  placeOrder(purchase: Purchase) {
    return this.httpClient.post<Purchase>(this.baseUrl, purchase);
  }
}
